//(function(aEvt) {
  var tracker = {
    track: function tracker_track(aOption) {
      var evt = new CustomEvent("mozCNUtils:Tracking", {
        bubbles: true,
        detail: aOption
      });
      window.dispatchEvent(evt);
    }
  };

  var defaultData = null;
  var startTime = Date.now();
  var logMsgCount = {};
  var logWithTime = function(aMsg) {
    var delay = Date.now() - startTime;
    logMsgCount[aMsg] = (logMsgCount[aMsg] || 0) + 1;

    if (logMsgCount[aMsg] == 1) {
      tracker.track({
        type: 'timing',
        action: [logMsgCount[aMsg], aMsg].join('-'),
        sid: delay
      });
    }
  };

  var numberFromError = function(aError, aNumberName) {
    if (!aError) {
      return;
    }

    var num = aError[aNumberName];
    if (isNaN(num)) {
      return;
    }
    return num.toString(10);
  };

  var reportError = function(aError) {
    var lineNo = numberFromError(aError, 'lineNumber') || '0'; // string is true
    var colNo = numberFromError(aError, 'columnNumber');

    var detail = {
      type: 'error',
      action: aError && aError.name || 'UnknownName',
      sid: colNo ? [colNo, lineNo].join('@') : lineNo,
      href: aError && aError.fileName,
      title: aError && aError.message
    };

    // console.log(arguments.callee.caller);
    // console.log(detail);

    if (detail.action != "AbortError") {
      tracker.track(detail);
    }
  };

  var fallbackToRO = function(aError) {
    var errorName = aError && aError.name;
    switch (errorName) {
      case 'InvalidStateError':
      case 'UnknownError':
        var evt = new CustomEvent("mozCNUtils:Diagnose", {
          bubbles: true,
          detail: errorName
        });
        window.dispatchEvent(evt);
        break;
    }

    document.location.replace('/readonly.html' + document.location.search);
  };

  var getLatestData = function() {
    if (window.mozCNChannel) {
      WebChannel.send("variant.channel");
    } else {
      var channel = "master-ii";
      if (window.mozCNUtils && window.mozCNUtils.variant) {
        channel = window.mozCNUtils.variant.channel;
      }
      WebChannel.handleData("variant.channel", channel);
    }
  };

  var getLastestDataForChannel = function(aChannel) {
    var xhr = new XMLHttpRequest();
    var channel = {
      'master-i': 'master-ii',
      'yazuo2': 'yazuo'
    }[aChannel] || aChannel;
    var region = GeoIP.region;
    var url = '/data/' + channel + '/defaultdials-' + region + '.json';

    xhr.open('GET', url, true);
    xhr.onload = function() {
      logWithTime('g-dials');
      try {
        defaultData = JSON.parse(xhr.responseText);

        if (DataBackup.batchUpdate) {
          // import from file/sync under way, do nothing here
        } else if (quickDialModule.fillDefaults) {
          quickDialModule.resetDials();
        } else {
          var tx = quickDialModule.updateDefaultDials(defaultData);
          if (tx) {
            tx.oncomplete = function() {
              logWithTime('f-dials');
            };
          }
        }

        var disabledMenuItems = document.querySelectorAll('#thumb-menu > menuitem[disabled="true"]');
        [].forEach.call(disabledMenuItems, function(aMenuItem) {
          aMenuItem.disabled = false;
        });
      } catch(e) {};

      xhr = new XMLHttpRequest();
      xhr.open('GET', '/data/sites.json', true);
      xhr.onload = function() {
        logWithTime('g-sites');
        try {
          var data = JSON.parse(xhr.responseText);
          Object.keys(data).forEach(function(aCat) {
            var tx = quickDialModule.updateSites(aCat, data[aCat]);
            if (tx) {
              tx.oncomplete = function() {
                logWithTime('f-' + aCat);
              };
            }
          });
        } catch(e) {};
      }
      xhr.send();
    };
    xhr.send();
  };
  var endHandler = function(aEvt) {
    if (document.hidden) {
      return;
    }

    logWithTime(aEvt.type);

    if (aEvt.type == 'updateready') {
      document.location.reload();
    }

    // get latest data if network connection is available
    if (aEvt.type == 'noupdate' || aEvt.type == 'noappcache') {
      getLatestData(aEvt.type);
    }
  };

  if (window.applicationCache) {
    applicationCache.addEventListener('checking', function(aEvt) {
      // startTime = Date.now();
    }, false);
    applicationCache.addEventListener('progress', function(aEvt) {}, false);
    applicationCache.addEventListener('noupdate', endHandler, false);
    applicationCache.addEventListener('error', endHandler, false);
    applicationCache.addEventListener('cached', endHandler, false);
    applicationCache.addEventListener('obsoleted', endHandler, false);
    applicationCache.addEventListener('updateready', endHandler, false);
  } else {
    setTimeout(endHandler, 0, { type: 'noappcache' });
  }

  /* above: appcache test;
     below: from about:ntab */

  var frameUrls = {
    nav: "https://newtab.firefoxchina.cn/site-tab-index.html",
    search: "https://newtab.firefoxchina.cn/world-tab-index.html"
  };

  var NTabUtils = {
    getPref: function NTabUtils_getPref(aKey, aDefault) {
      var item = null;
      try {
        item = localStorage.getItem(aKey);
      } catch(e) {
        this.handleLSError(e);
      }
      if (typeof(item) === 'string') {
        try {
          return JSON.parse(item);
        } catch(e) {}
      }
      return item || aDefault;
    },
    setPref: function NTabUtils_setPref(aKey, aValue) {
      try {
        var origValue = localStorage.getItem(aKey);
        if (aValue === undefined) {
          localStorage.removeItem(aKey);
        } else {
          localStorage.setItem(aKey, aValue);
        }
        if (origValue != aValue) {
          NTab.observer.observe(null, 'storage:changed', aKey);
          DataBackup.maybeSyncForPref(aKey);
        }
      } catch(e) {
        this.handleLSError(e);
      };
    },
    handleLSError: function NTabUtils_handleLSError(aError) {
      if (!aError) {
        return;
      }

      switch (aError.name) {
        case 'NS_ERROR_FILE_CORRUPTED':
        case 'NS_ERROR_FILE_NO_DEVICE_SPACE':
        case 'SecurityError':
        case 'TypeError':
        case 'NS_ERROR_STORAGE_IOERR':
        case 'NS_ERROR_OUT_OF_MEMORY':
        case 'NS_ERROR_NOT_INITIALIZED':
        case 'NS_ERROR_DOM_QUOTA_REACHED':
        case 'NS_ERROR_STORAGE_BUSY':
          // show related error msg to user ?
          break;
        default:
          reportError(aError);
      }
    },
    loadIFrame: function NTabUtils_loadIFrame(aFrame, aSrc) {
      /*
      restart with different number of iframes in the same page will cause iframes
      pre-loaded with incorrect document, which may happen during an update.
      so we force refresh any pre-loaded document with about:blank first
      */
      if (!aFrame) {
        return;
      }
      var blank = 'about:blank';
      if (!aSrc) {
        aSrc = blank;
      }

      if (aFrame.contentDocument &&
          aFrame.contentDocument.URL != blank) {
        aFrame.setAttribute('src', blank);
      }
      aFrame.setAttribute('src', aSrc);
      if (aSrc == blank) {
        aFrame.removeAttribute('src');
      }
    },
    getBlobForURI: function NTabUtils_getBlobForURI(aURI, aOnLoad, aOnError) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', aURI, true);
      xhr.responseType = 'blob';
      xhr.onload = aOnLoad;
      xhr.onerror = aOnError;
      xhr.send();
    }
  };

  var Grid = {
    _pendingImagesFromExtension: {},
    get customizedSize() {
      return (this.gridSize.col !== 4) || (this.gridSize.row !== 2);
    },
    get gridSize() {
      var col = NTabUtils.getPref('moa.ntab.dial.column', 4);
      var row = NTabUtils.getPref('moa.ntab.dial.row', 2);
      col = Math.max(2, Math.min(col, 6));
      row = Math.max(1, Math.min(row, 20));
      return {
        'col': col,
        'row': row
      }
    },
    set gridSize(aSize) {
      NTabUtils.setPref('moa.ntab.dial.column', aSize.col);
      NTabUtils.setPref('moa.ntab.dial.row', aSize.row);
    },
    get gridContainer() {
      delete this.gridContainer;
      return this.gridContainer = document.querySelector('#grid');
    },
    get gridItemHeight() {
      var gridItem = document.querySelector('span.thumb');
      var width = document.defaultView.getComputedStyle(gridItem).width;
      return Math.round(parseInt(width, 10) * 0.62);
    },
    get gridItemMaxWidth() {
      // see also: max-width of "#grid > ol" in /static/css/offlintab.css
      return 270 + 2 * 10;
    },
    get gridItemOpacity() {
      var useOpacity = NTabUtils.getPref('moa.ntab.dial.useopacity', false);
      document.querySelector('#nt-useopacity').checked = !!useOpacity;
      return useOpacity;
    },
    set gridItemOpacity(aUseOpacity) {
      NTabUtils.setPref('moa.ntab.dial.useopacity', aUseOpacity);
    },
    get gridItemStyle() {
      var cssRules = [],
          doc = document;
      for(var i = 0, l = doc.styleSheets.length; i < l; i++) {
        if(doc.styleSheets[i].href &&
           doc.styleSheets[i].href.indexOf(doc.location.origin) === 0) {
          cssRules = doc.styleSheets[i].cssRules;
          break;
        }
      }
      var gridItemStyle = null;
      for(var i = 0, l = cssRules.length; i < l; i++) {
        if(cssRules[i].selectorText == "#grid > ol > li") {
          gridItemStyle = cssRules[i];
          break;
        }
      }
      delete this.gridItemStyle;
      return this.gridItemStyle = gridItemStyle;
    },
    get topFlexHeight() {
      var container = QDTabs.qdTabPanels;
      var oHeight = document.defaultView.getComputedStyle(container).height;
      oHeight = parseInt(oHeight, 10);
      var iHeight = this.gridSize.row * (this.gridItemHeight + 20);
      return (oHeight - iHeight) / 2 - 50 / 2 - 20;
    },
    _editGridItem: function Grid__editGridItem(aIndex) {
      var dial = quickDialModule.getCachedDial(aIndex);
      Overlay.overlay.style.display = 'block';
      Overlay.overlay.setAttribute('data-index', aIndex);
      if (dial && dial.url) {
        Overlay.inputTitle.value = dial.title || dial.url;
        Overlay.inputUrl.value = dial.url;
      }
      Overlay.init();
    },
    _itemEventInit: function Grid__itemEventInit(aLi) {
      var self = this;
      var index = aLi.getAttribute('data-index');
      var button = aLi.querySelectorAll('button');
      var thumb = aLi.querySelector('span.thumb');
      var title = aLi.getAttribute('title');
      if (button.length) {
        button[0].addEventListener('click', function(evt) {
          self._editGridItem(index);
        }, false);
        button[1].addEventListener('click', function(evt) {
          self.refreshGridItem(index);
        }, false);
        button[2].addEventListener('click', function(evt) {
          if (confirm('你确定要删除 "%S" 吗？'.replace('%S', title))) {
            var request = quickDialModule.removeDial(index);
            request.onsuccess = function() {
              self.updateGridItem(index, true);
            };
          }
        }, false);
      }
      aLi.querySelector('a').addEventListener('click', function(evt) {
        if (evt.currentTarget.href &&
            evt.currentTarget.href != document.location.href) {
          var fid = aLi.getAttribute('data-fid');
          if (!fid) {
            return;
          }

          tracker.track({ type: 'quickdial', action: 'click', fid: fid, sid: index });
        } else {
          self._editGridItem(index);
          evt.preventDefault();
        }
      }, false);
      var offlintabDragType = 'application/x-offlintab-dial-index';
      aLi.addEventListener('dragstart', function(evt) {
        evt.dataTransfer.mozSetDataAt(offlintabDragType,
          evt.currentTarget.getAttribute('data-index'), 0);
      }, false);
      aLi.addEventListener('dragover', function(evt) {
        evt.preventDefault();
      }, false);
      aLi.addEventListener('dragenter', function(evt) {
        if (!(evt.dataTransfer.types.includes ?
              evt.dataTransfer.types.includes(offlintabDragType) :
              evt.dataTransfer.types.contains(offlintabDragType))) {
          return;
        }

        evt.preventDefault();
      }, false);
      aLi.addEventListener('drop', function(evt) {
        if (!(evt.dataTransfer.types.includes ?
              evt.dataTransfer.types.includes(offlintabDragType) :
              evt.dataTransfer.types.contains(offlintabDragType))) {
          return;
        }

        evt.preventDefault();
        var incomingIndex = evt.dataTransfer.mozGetDataAt(offlintabDragType, 0);

        if (incomingIndex == index) {
          return;
        }
        var indexA = incomingIndex;
        var indexB = index;
        var tx = quickDialModule.exchangeDial(indexA, indexB);
        tx.oncomplete = function() {
          self.updateGridItem(indexA, true);
          self.updateGridItem(indexB, true);
        }
      }, false);
    },
    _createGridItem: function Grid__createGridItem(aIndex) {
      var dial = quickDialModule.getCachedDial(aIndex);

      var li = document.createElement('li');
      li.setAttribute('draggable', dial ? 'true' : 'false');
      li.setAttribute('data-index', aIndex);
      li.setAttribute('data-fid', dial && dial.defaultposition || '');
      li.setAttribute('title', dial ?
        dial.title || '' :
        '点击添加新的标签页');

      if (dial) {
        var edit = document.createElement('button');
        edit.setAttribute('title', '编辑');
        li.appendChild(edit);
        var refresh = document.createElement('button');
        refresh.setAttribute('title', '刷新');
        li.appendChild(refresh);
        var remove = document.createElement('button');
        remove.setAttribute('title', '删除');
        li.appendChild(remove);
      }

      if (dial && dial.frame) {
        var iframe = document.createElement('iframe');
        window.setTimeout(function() {
          NTabUtils.loadIFrame(iframe, dial.frame);
        }, 0);
        li.appendChild(iframe);
        li.classList.add('frame');
      }

      var a = document.createElement('a');
      a.setAttribute('draggable', 'false');
      a.setAttribute('href', dial && dial.url || '');
      if (dial) {
        a.setAttribute('contextmenu', 'thumb-menu');
      }

      var span_thumb = document.createElement('span');
      span_thumb.className = 'thumb';

      var backgroundImage = '';
      var errorImage = 'url(resource://gre-resources/broken-image.png)';
      var pendingImage = 'url(/static/img/icon/animated.png)';

      var setBackground = function(aImage, aGenerated) {
        span_thumb.style.backgroundImage = aImage;
        span_thumb.style.backgroundPosition = aGenerated
                                            ? 'left top'
                                            : 'center center';
        span_thumb.style.backgroundSize = aGenerated ? 'cover' : '';
      };

      var self = this;
      var getImageFromExtension = function(aUrl) {
        self._pendingImagesFromExtension[aUrl] = function (aResult) {
          if (aResult) {
            var blobUrl = URL.createObjectURL(aResult);
            backgroundImage = 'url(' + blobUrl + ')';
            setBackground(backgroundImage, true);
            quickDialModule.updateImage(aUrl, aResult);
          } else {
            setBackground(errorImage, false);
          }
        };
        setBackground(pendingImage, false);

        if (window.mozCNChannel) {
          WebChannel.send("thumbs.getThumbnail", { url: aUrl });
        } else if (window.mozCNUtils && window.mozCNUtils.thumbs) {
          var request = window.mozCNUtils.thumbs.getThumbnail(aUrl);
          request.onsuccess = function() {
            WebChannel.handleData("thumbs.getThumbnail", {
              url: aUrl,
              blob: request.result
            });
          };
          request.onerror = function() {
            WebChannel.handleData("thumbs.getThumbnail", { url: aUrl });
          }
        } else {
          WebChannel.handleData("thumbs.getThumbnail", { url: aUrl });
        }
      }

      var getImageForDial = function(aDial) {
        if (dial.thumbnail) {
          NTabUtils.getBlobForURI(dial.thumbnail, function(aEvt) {
            var xhr = aEvt.target;
            var blobUrl = URL.createObjectURL(xhr.response);
            backgroundImage = 'url(' + blobUrl + ')';
            setBackground(backgroundImage, false);
            quickDialModule.updateImage(dial.thumbnail, xhr.response);
          }, function() {
            setBackground(errorImage, false);
          });
        } else {
          getImageFromExtension(aDial.url);
        }
      };

      if (dial) {
        if (dial.thumbnail && dial.thumbnail.indexOf('data:') == 0) {
          setBackground('url(' + dial.thumbnail + ')', false);
        } else {
          var request = quickDialModule.getImage(dial.thumbnail || dial.url);
          if (request) {
            request.onsuccess = function() {
              var result = request.result;
              if (result) {
                var blobUrl = URL.createObjectURL(result);
                backgroundImage = 'url(' + blobUrl + ')';
                setBackground(backgroundImage, !dial.thumbnail);
              } else {
                getImageForDial(dial);
              }
            };
            request.onerror = function() {
              getImageForDial(dial);
            };
          } else {
            setBackground('url(' + dial.thumbnail + ')', false);
          }
        }
      } else {
        setBackground(backgroundImage, false);
      }

      a.appendChild(span_thumb);

      var span_title = document.createElement('span');
      span_title.className = 'title';
      span_title.textContent = dial && dial.title || '';
      a.appendChild(span_title);

      li.appendChild(a);
      this._itemEventInit(li);

      return li;
    },
    _createGrid: function Grid__createGrid() {
      var customizedSize = this.customizedSize;
      var gridSize = this.gridSize;

      var total = gridSize.col * gridSize.row;
      var className_ = customizedSize ? 'c' + gridSize.col : '';
      this.gridContainer.className = className_;

      var ol = document.createElement('ol');
      for (var i = 1; i <= total; i++) {
        var gridItem = this._createGridItem(i);
        ol.appendChild(gridItem);
      }
      return ol;
    },
    _updateSettingsDisplay: function Grid__updateSettingsDisplay() {
      var rowSelect = document.querySelector('#row_num');
      var colSelect = document.querySelector('#col_num');
      if (!rowSelect || !colSelect) {
        var error = new TypeError("TypeError: {row,col}Select is null");
        reportError(error);
        fallbackToRO(error);
        return;
      }

      var limit = NTabUtils.getPref('moa.ntab.dial.rowlimit', 4);
      var row = this.gridSize.row;
      if (row > limit) {
        limit = Math.ceil(row / 5) * 5;
        NTabUtils.setPref('moa.ntab.dial.rowlimit', limit);
      }
      for (var i = rowSelect.childElementCount + 1; i <= limit; i++) {
        var option = document.createElement('option');
        option.textContent = i;
        option.value = i;
        rowSelect.appendChild(option);
      }
      rowSelect.value = this.gridSize.row;
      colSelect.value = this.gridSize.col;
    },
    _scroll: function Grid__scroll(aDirection, aSpeed) {
      this.gridContainer.scrollTop += aDirection * aSpeed;
    },
    _scrollInterval: null,
    _eventInit: function Grid__eventInit() {
      var self = this;
      window.addEventListener('resize', function(evt) {
        self.resize();
      }, false);
      document.addEventListener('keypress', function(evt) {
        var direction = 0;
        switch(evt.keyCode) {
          case 33:
          case 36:
          case 38:
            direction = -1;
            break;
          case 34:
          case 35:
          case 40:
            direction = 1;
            break;
        }
        var speed = 0;
        switch(evt.keyCode) {
          case 33:
          case 34:
            speed = 3;
            break;
          case 35:
          case 36:
            speed = 20;
            break;
          case 38:
          case 40:
            speed = 1;
            break;
        }
        speed *= (self.gridItemHeight + 20);
        self._scroll(direction, speed);
      }, false);

      if (!this.gridContainer) {
        var error = new TypeError("TypeError: Grid.gridContainer is null");
        reportError(error);
        fallbackToRO(error);
        return;
      }

      if (window.WheelEvent) {
        this.gridContainer.addEventListener('wheel', function(evt) {
          if (evt.ctrlKey) {
            return;
          }
          var direction = evt.deltaY / Math.abs(evt.deltaY);
          var speed = 0;
          switch (evt.deltaMode) {
            case evt.DOM_DELTA_LINE:
              speed = 1;
              break;
            case evt.DOM_DELTA_PAGE:
              speed = 3;
              break;
          }
          speed *= (self.gridItemHeight + 20);
          if (!speed) {
            speed = Math.abs(evt.deltaY);
          }
          self._scroll(direction, speed);
        }, false);
      } else {
        this.gridContainer.addEventListener('MozMousePixelScroll', function(evt) {
          if (evt.ctrlKey) {
            return;
          }
          self._scroll(1, evt.detail);
        }, false);
      }
      this.gridContainer.addEventListener('contextmenu', function(evt) {
        var index = evt.target.parentNode.parentNode.getAttribute('data-index');
        if (index) {
          document.querySelector('#thumb-menu').setAttribute('data-index', index);
        }
      }, false);

      [].forEach.call(document.querySelectorAll('#grid > ul > li'), function(aLi) {
        aLi.addEventListener('click', function(evt) {
          evt.stopPropagation();
        }, false);
        aLi.addEventListener('mouseover', function(evt) {
          var direction = evt.target.getAttribute('data-direction');
          evt.target.parentNode.setAttribute('data-scroll', direction);
          window.clearInterval(self._scrollInterval);
          self._scrollInterval = window.setInterval(function() {
            self._scroll(direction, 10);
          }, 20);
        }, false);
        aLi.addEventListener('mouseout', function(evt) {
          window.clearInterval(self._scrollInterval);
          self._scrollInterval = null;
          evt.target.parentNode.setAttribute('data-scroll', '0');
        }, false);
      });
    },
    editGridItem: function Grid_editGridItem(aIndex) {
      this._editGridItem(aIndex || document.querySelector('#thumb-menu').getAttribute('data-index'));
    },
    init: function Grid_init() {
      this.update();
      this._eventInit();
    },
    refreshAll: function Grid_refreshAll() {
      var self = this;
      var tx = quickDialModule.clearThumbnails();
      tx.oncomplete = function() {
        self.update();
      };
    },
    refreshGridItem: function Grid_refreshGridItem(aIndex) {
      var index = aIndex || document.querySelector('#thumb-menu').getAttribute('data-index');
      var dial = quickDialModule.getCachedDial(index);
      if (dial) {
        quickDialModule.removeImage(dial.url);
        this.updateGridItem(index, false);
      }
    },
    resize: function Grid_resize() {
      if (!this.gridItemStyle) {
        var error = new TypeError("TypeError: Grid.gridItemStyle is null");
        reportError(error);
        fallbackToRO(error);
        return;
      }

      this.gridItemStyle.style.height = this.gridItemHeight + 'px';
      this.gridItemStyle.style.opacity = this.gridItemOpacity ? 0.7 : 1;
      this.gridContainer.firstElementChild.style.height = Math.max(this.topFlexHeight, 0) + 'px';

      var iHeight = this.gridContainer.scrollHeight;
      var oHeight = document.defaultView.getComputedStyle(this.gridContainer);
      oHeight = parseInt(oHeight.height, 10);
      if (iHeight > oHeight) {
        document.querySelector('#grid > ul').setAttribute('data-scroll', '0');
      } else {
        document.querySelector('#grid > ul').removeAttribute('data-scroll');
      }
    },
    update: function Grid_update() {
      this._updateSettingsDisplay();

      if (!this.gridContainer) {
        var error = new TypeError("TypeError: Grid.gridContainer is null");
        reportError(error);
        fallbackToRO(error);
        return;
      }

      var oldGrid = this.gridContainer.querySelector('ol');
      var newGrid = this._createGrid();
      if (oldGrid) {
        this.gridContainer.replaceChild(newGrid, oldGrid);
      } else {
        this.gridContainer.appendChild(newGrid);
      }
      logWithTime('u-grid');
      this.resize();
    },
    updateGridItem: function Grid_updateGridItem(aIndex, aNotify) {
      var self = this;
      var request = quickDialModule.getDial(aIndex);
      request.onsuccess = function() {
        var dial = request.result;

        /* shouldn't be here ... hmmm
           can I get request result from tx ? */
        if (dial) {
          quickDialModule.updateCachedDial(aIndex, dial, !!aNotify);
        } else {
          quickDialModule.removeCachedDial(aIndex, !!aNotify);
        }

        var newItem = self._createGridItem(aIndex);

        var oldItem = document.querySelector('li[data-index="' + aIndex + '"]');
        if (oldItem) {
          oldItem.parentNode.replaceChild(newItem, oldItem);
        }
      }
    },
    gotImageFromExtension: function Grid_gotImageFromExtension(aData) {
      var pendingImage = this._pendingImagesFromExtension[aData.url];
      if (!pendingImage) {
        return;
      }

      pendingImage(aData.blob);
      delete this._pendingImagesFromExtension[aData.url];
    }
  };

  var Background = {
    get backgroundColor() {
      return NTabUtils.getPref('moa.ntab.backgroundcolor', 'transparent');
    },
    set backgroundColor(aColor) {
      NTabUtils.setPref('moa.ntab.backgroundcolor', aColor);
      if (aColor) {
        this.setBackgroundImage('');
      }
    },
    // blob url, should not be synced?
    get backgroundImageURL() {
      return NTabUtils.getPref('moa.ntab.backgroundimage', '');
    },
    set backgroundImageURL(aImage) {
      NTabUtils.setPref('moa.ntab.backgroundimage', aImage);
      if (aImage) {
        this.backgroundColor = '';
      }
    },
    get backgroundImageStyle() {
      return NTabUtils.getPref('moa.ntab.backgroundimagestyle', 'fill');
    },
    set backgroundImageStyle(aStyle) {
      NTabUtils.setPref('moa.ntab.backgroundimagestyle', aStyle);
    },
    get backgroundNoise() {
      return NTabUtils.getPref('moa.ntab.backgroundnoise', false);
    },

    _styleToPRS: function Background__styleToPRS(aStyle) {
      switch (aStyle) {
        case 'fit':
          return {
            position: 'center center',
            repeat: 'no-repeat',
            size: 'contain'
          };
        case 'stretch':
          return {
            position: '',
            repeat: 'no-repeat',
            size: '100% 100%'
          };
        case 'tile':
          return {
            position: '',
            repeat: 'repeat',
            size: ''
          };
        case 'center':
          return {
            position: 'center center',
            repeat: 'no-repeat',
            size: ''
          };
        case 'fill':
        default:
          return {
            position: '',
            repeat: 'no-repeat',
            size: 'cover'
          };
      }
    },
    init: function Background_init() {
      var self = this;
      var request = quickDialModule.getImage('background');
      if (request) {
        request.onsuccess = function() {
          var result = request.result;
          if (result) {
            self.backgroundImageURL = URL.createObjectURL(result);
            // this will trigger Background.update through storage event
          } else {
            self.backgroundImageURL = '';
            self.update();
          }
        };
        request.onerror = function() {
          self.backgroundImageURL = '';
          self.update();
        };
      } else {
        this.update();
      }
    },
    setBackgroundImage: function Background_setBackgroundImage(aImage) {
      var self = this;
      var request = null;
      if (aImage) {
        request = quickDialModule.updateImage('background', aImage);
        request.onsuccess = function() {
          self.backgroundImageURL = URL.createObjectURL(aImage);
        };
        request.onerror = function() {};
      } else {
        request = quickDialModule.removeImage('background');
        request.onsuccess = function() {
          self.backgroundImageURL = '';
        };
        request.onerror = function() {};
      }
    },
    update: function Background_update() {
      var color = this.backgroundColor;
      var image = this.backgroundImageURL;
      var noise = this.backgroundNoise;
      var style = this.backgroundImageStyle;

      var prs = this._styleToPRS(style);

      if (!NTab.body) {
        var error = new TypeError("TypeError: NTab.body is null");
        reportError(error);
        fallbackToRO(error);
        return;
      }

      NTab.body.style.backgroundImage = image ? 'url("' + image + '")' : '';
      NTab.body.style.backgroundPosition = image ? prs.position : '';
      NTab.body.style.backgroundRepeat = image ? prs.repeat: '';
      NTab.body.style.backgroundSize = image ? prs.size : '';
      NTab.body.style.backgroundColor = color;
      if (!image && !noise) {
        NTab.body.style.backgroundImage = 'url("")';
      }

      if (color) {
        var shouldCheck = document.querySelector('#bgcolor-radio > label > input[value="' + color + '"]');
        if (shouldCheck) {
          shouldCheck.checked = 'checked';
        }
      } else {
        var checked_ = document.querySelector('#bgcolor-radio > label > input[name="bgcolor"]:checked');
        if (checked_) {
          checked_.checked = '';
        }
      }
      if (style) {
        var shouldCheck = document.querySelector('#bgimagestyle-radio > label > input[value="' + style + '"]');
        if (shouldCheck) {
          shouldCheck.checked = 'checked';
        }
      } else {
        var checked_ = document.querySelector('#bgimagestyle-radio > label > input[name="bgimage-style"]:checked');
        if (checked_) {
          checked_.checked = '';
        }
      }
      //document.querySelector('input[name="bgimage"]').value = image;
      document.getElementById('bgimagestyle-radio').hidden = !image;
    },
  };

  var Footer = {
    get displayFooter() {
      return NTabUtils.getPref('moa.ntab.displayfooter', true);
    },
    set displayFooter(aDisplay) {
      NTabUtils.setPref('moa.ntab.displayfooter', aDisplay);
    },
    get footer() {
      delete this.footer;
      return this.footer = document.querySelector('footer');
    },
    get toggle() {
      delete this.toggle;
      return this.toggle = document.querySelector('#toggle');
    },
    init: function Footer__init() {
      var self = this;
      this.toggle.addEventListener('click', function(evt) {
        self.displayFooter = !self.displayFooter;
      }, false);
      this.update();
    },
    update: function Footer_update() {
      if (this.displayFooter) {
        this.footer.classList.remove('off');
      } else {
        this.footer.classList.add('off');
      }
      // refresh the scroll control
      Grid.resize();
    },
  };

  var QDTabs = {
    get qdTabPanels() {
      delete this.qdTabPanels;
      return this.qdTabPanels = document.querySelector('#quick_dial_tabpanels');
    },
  };

  var Overlay = {
    get editorTabs() {
      delete this.editorTabs;
      return this.editorTabs = this.overlay.querySelectorAll('#editor_tabs > li');
    },
    get inputTitle() {
      delete this.inputTitle;
      return this.inputTitle = this.overlay.querySelector('input[name="title"]');
    },
    get inputUrl() {
      delete this.inputUrl;
      return this.inputUrl = this.overlay.querySelector('input[name="url"]');
    },
    get overlay() {
      delete this.overlay;
      return this.overlay = document.querySelector('#overlay');
    },
    _inited: false,
    _limits: {
      'frequent': 9,
      'last': 9
    },
    init: function Overlay_init() {
      if (this._inited) {
        return;
      }
      var self = this;
      document.querySelector('#prompt-close').addEventListener('click', function(evt) {
        self._finish();
      }, false);
      this.overlay.addEventListener('click', function(evt) {
        if (evt.target == evt.currentTarget) {
          self._finish();
        }
      }, false);
      document.addEventListener('keypress', function(evt) {
        if (evt.keyCode == 27) {
          self._finish();
        };
      }, false);

      if (window.mozCNChannel) {
        WebChannel.send('frequent.query', { limit: this._limits['frequent'] });
        WebChannel.send('last.query', { limit: this._limits['last'] });
        WebChannel.send('bookmark.query');
      } else if (window.mozCNUtils) {
        window.mozCNUtils.frequent.queryAsync(this._limits['frequent'], function (aItems) {
          WebChannel.handleData('frequent.query', aItems);
        });
        window.mozCNUtils.last.queryAsync(this._limits['last'], function (aItems) {
          WebChannel.handleData('last.query', aItems);
        });
        window.mozCNUtils.bookmarks.queryAsync(function (aItems) {
          WebChannel.handleData('bookmark.query', aItems);
        });
      }

      var tmp = {
        top: document.createElement('ul'),
        bottom: document.createElement('ul')
      };
      quickDialModule.refreshSites('frequentsites', function(aKey, aVal) {
        li = self._createListItem(aVal.title, aVal.href, false);
        if (parseInt(aKey, 10) < 50) {
          tmp.top.appendChild(li);
        } else {
          tmp.bottom.appendChild(li);
        }
      }, function() {
        var top = document.querySelector('#editor_promoted > ul:first-of-type');
        top.parentNode.replaceChild(tmp.top, top);

        var bottom = document.querySelector('#editor_promoted > ul:last-of-type');
        bottom.parentNode.replaceChild(tmp.bottom, bottom);
      });

      [].forEach.call(this.editorTabs, function(tab) {
        tab.addEventListener('mouseover', function(evt) {
          evt.target.parentNode.className = evt.target.getAttribute('data-tab');
        }, false);
      });
      document.querySelector('#dial_editor').addEventListener('submit', function(evt) {
        evt.preventDefault();
        var title = self.inputTitle.value;
        var url = self.inputUrl.value;
        self._finish(title, url);
      }, false);

      this._inited = true;
    },
    createList: function Overlay__createList(aItems, aType) {
      var count = 0;
      var self = this;
      var tmp = document.createElement('ul');
      tmp.id = 'editor_' + aType;
      var limit = this._limits[aType];

      aItems.forEach(function({title, url}) {
        if (limit && (count >= limit)) {
          return;
        }
        count += 1;

        var li = self._createListItem(title, url, true);
        tmp.appendChild(li);
      });
      var existed = document.querySelector('#editor_' + aType);
      existed.parentNode.replaceChild(tmp, existed);
      var tab = document.querySelector('li[data-tab="editor_' + {
        'bookmark': 'bookmark',
        'frequent': 'related',
        'last': 'related'
      }[aType] || 'dummy' + '"]');
      if (tab && tab.hidden) {
        tab.hidden = false;
      }
    },
    _createListItem: function Overlay__createListItem(aTitle, aUrl, aShowFavicon) {
      var self = this;
      var li = document.createElement('li');
      var anchor = document.createElement('a');
      anchor.href = aUrl;
      anchor.textContent = aTitle || aUrl;
      anchor.title = aUrl;
      anchor.addEventListener('click', function(evt) {
        evt.preventDefault();
        var title = evt.target.textContent.replace(/\s+/g, ' ');
        var url = evt.target.href;
        self._choose(title, url, false);
      }, false);

      if (aShowFavicon && /^https?:/.test(anchor.protocol)) {
        setTimeout(function() {
          var favicon = 'url(' + anchor.protocol + '//' + anchor.host + '/favicon.ico)';
          anchor.style.backgroundImage = favicon;
        }, 0);
      }
      li.appendChild(anchor);
      return li;
    },
    _choose: function Overlay__choose(aTitle, aUrl, aTrack) {
      this.inputTitle.value = aTitle;
      if (aTrack) {
        this.inputTitle.setAttribute('data-track', 'track');
      }
      this.inputUrl.value = aUrl;
    },
    _finish: function Overlay__finish(aTitle, aUrl) {
      var index = this.overlay.getAttribute('data-index');
      var dial = quickDialModule.getCachedDial(index);
      if (aUrl && (!dial ||
                   !(dial.defaultposition && dial.url == aUrl))) {
        if (!/^(ftp|https?):\/\//.test(aUrl)) {
          aUrl = 'http://' + aUrl;
        }

        var request = quickDialModule.updateDial(index, {
          url: aUrl,
          title: aTitle
        }, false);
        request.onsuccess = function() {
          Grid.updateGridItem(index, true);
        };
      }
      if (this.inputTitle.hasAttribute('data-track')) {
        tracker.track({ type: 'links', action: 'click', sid: aTitle });
      }
      this.overlay.style.display = '';
      this.inputTitle.value = '';
      this.inputUrl.value = '';
      this.inputTitle.removeAttribute('data-track');
    },
  };

  var Launcher = {
    get launcher() {
      delete this.launcher;
      return this.launcher = document.querySelector('#launcher');
    },
    _settingsInit: function Launcher__settingsInit() {
      [].forEach.call(document.querySelectorAll('#bgcolor-radio > label > input[name="bgcolor"]'), function(input) {
        input.addEventListener('click', function(evt) {
          Background.backgroundColor = evt.target.value;
        }, false);
      });
      document.querySelector('input[name="bgimage"]').addEventListener('change', function(evt) {
        var file = evt.target.files[0];
        evt.target.value = '';
        Background.setBackgroundImage(file);
      }, false);
      [].forEach.call(document.querySelectorAll('#bgimagestyle-radio > label > input[name="bgimage-style"]'), function(input) {
        input.addEventListener('click', function(evt) {
          Background.backgroundImageStyle = evt.target.value;
        }, false);
      });
      [].forEach.call(document.querySelectorAll('select'), function(select) {
        select.addEventListener('change', function(evt) {
          switch(evt.currentTarget.id) {
            case 'row_num':
            case 'col_num':
              Grid.gridSize = {
                row: parseInt(document.getElementById('row_num').value, 10),
                col: parseInt(document.getElementById('col_num').value, 10)
              };
              break;
          }
        }, false);
      });
      [].forEach.call(document.querySelectorAll('#page-settings > fieldset > div > input[type="button"]'), function(input) {
        input.addEventListener('click', function(evt) {
          switch(evt.target.id) {
            case 'bgreset':
              Background.backgroundColor = 'transparent';
              break;
            case 'resetpref':
              localStorage.clear();
              NTab.observer.observe(null, 'storage:changed', null);
              DataBackup.exportToSync();
              break;
            case 'feedback':
              window.open('https://doc.firefoxchina.cn/document/feedback/');
              break;
          }
        }, false);
      });
      [].forEach.call(document.querySelectorAll('#page-settings > fieldset > div > label > input[type="checkbox"]'), function(input) {
        input.addEventListener('click', function(evt) {
          NTabUtils.setPref(evt.target.getAttribute('data-pref'), evt.target.checked);
        }, false);
      });
    },
    init: function Launcher_init() {
      var self = this;
      [].forEach.call(document.querySelectorAll('#launcher > li'), function(li) {
        li.addEventListener('click', function(evt) {
          var menu = evt.target.getAttribute('data-menu');
          if (menu) {
            self.launcher.classList.toggle(menu);
            if (self.launcher.classList.length) {
              self.launcher.className = menu;
            }
            tracker.track({ type: 'menu', action: 'click', sid: menu });
          }
          evt.stopPropagation();
        }, false);
      });
      document.addEventListener('click', function(evt) {
        self.launcher.className = '';
      }, false);
      document.addEventListener('keypress', function(evt) {
        if (evt.keyCode == 27) {
          self.launcher.className = '';
        };
      }, false);
      this._settingsInit();
    },
  };

  var DataBackup = {
    _prefix: 'moa.ntab.',
    _prefs: [
      'backgroundcolor',
      'backgroundimagestyle',
      'backgroundnoise',
      'dial.column',
      'dial.hideSearch',
      'dial.row',
      'dial.useopacity',
      'displayfooter',
      'openLinkInNewTab',
      'qdtab',
      'search.engine',
      'view'
    ],

    evtType: 'mozCNUtils:NTabSync',

    // for a series of updates, only notify sync after all of them applied
    BATCH_OTHER: -1,
    BATCH_NONE: 0,
    BATCH_FILE: 1,
    BATCH_SYNC: 2,
    batchUpdate: 0,

    _sendSyncEvent: function(aType, aID) {
      var exported = this._exportToObj(false);
      try {
        var evt = new CustomEvent(this.evtType, {
          detail: {
            dir: 'content2fs',
            data: {
              id: (aID || Date.now()),
              state: exported.dataString,
              type: aType
            }
          }
        });
        window.dispatchEvent(evt);
      } catch(e) {};

      if (document.location.protocol === 'https:') {
        return;
      }
      try {
        var evt = new CustomEvent('mozCNUtils:NTabDB', {
          detail: {
            dir: 'content2fs',
            data: {
              useDefaultDials: exported.useDefaultDials
            }
          }
        });
        window.dispatchEvent(evt);
      } catch(e) {};
    },
    handleEvent: function(aEvt) {
      if (aEvt.type != this.evtType) {
        return;
      }

      if (!aEvt.detail || aEvt.detail.dir != 'fs2content' ||
          !aEvt.detail.data) {
        return;
      }

      var data = aEvt.detail.data;

      switch (data.type) {
        case 'ready':
          this._sendSyncEvent('ready');
          break;
        case 'update':
          this.importFromSync(data.id, data.state);
          break;
      }
    },

    _exportToObj: function(aIndexOnly) {
      var self = this;
      var dialContent = {};
      var useDefaultDials = true;

      var keys = quickDialModule.keys;
      for (var i = 0, l = keys.length; i < l; i++){
        try {
          var index = keys[i];
          var item = quickDialModule.getCachedDial(index);
          dialContent[index] = (aIndexOnly && item.defaultposition) || item;
          if (useDefaultDials && (index != item.defaultposition)) {
            useDefaultDials = false;
          }
        } catch(e) {};
      }

      var userDataJSON = {
        dialContent: dialContent
      };

      this._prefs.forEach(function(aPref) {
        var userValue = NTabUtils.getPref(self._prefix + aPref, null);
        if (userValue !== null) {
          userDataJSON[aPref] = userValue;
        }
      });

      // encoder ?
      return {
        dataString: JSON.stringify(userDataJSON),
        useDefaultDials
      };
    },
    exportToFile: function() {
      try {
        var data = this._exportToObj(true).dataString;
        var blob = new Blob([data], {
          type: 'application/json'
        });
        var anchor = document.querySelector('#export-to');
        anchor.href = URL.createObjectURL(blob);
        anchor.click();
      } catch(e) {
        alert('有错误发生，请再尝试一次\n' + e);
      }
    },
    exportToSync: function() {
      if (this.batchUpdate) {
        return;
      }

      this._sendSyncEvent("update");
    },
    maybeSyncForPref: function(aPref) {
      if (!aPref || this._prefs.indexOf(aPref.slice(this._prefix.length)) < 0) {
        return;
      }

      this.exportToSync();
    },

    _importFromString: function(aState, aID) {
      var self = this;

      // decoder ?
      var userDataJSON = JSON.parse(aState);

      var dialContent = userDataJSON.dialContent;
      for (var index in dialContent) {
        if (/^\d+$/.test(index)) {
          var dial = dialContent[index];
          if (/^\d+$/.test(dial)) {
            dialContent[index] = defaultData[dial];
            dial = dialContent[index];
          }
          if ((!dial.title && dial.title !== '') ||
              !dial.url ||
              /javascript\s*:/.test(dial.url)) {
            throw '非法的标题或者网址';
          }
        } else {
          throw '非法的序号';
        }
      }

      this._prefs.forEach(function(aPref) {
        try {
          NTabUtils.setPref(self._prefix + aPref, userDataJSON[aPref]);
        } catch(e) {}
      });

      if (Object.keys(dialContent).length) {
        quickDialModule.resetDials(dialContent, aID);
      } else {
        this.endBatchUpdate(aID);
      }
    },
    importFromFile: function() {
      if (this.batchUpdate) {
        return;
      }

      var self = this;
      var fileInput = document.querySelector('#import-from');
      fileInput.addEventListener('change', function(evt) {
        var file = evt.target.files[0];

        var fileReader = new FileReader();
        fileReader.onload = function() {
          try {
            self.batchUpdate = self.BATCH_FILE;
            self._importFromString(fileReader.result);
          } catch(e) {
            self.endBatchUpdate();
            alert('有错误发生，请再尝试一次\n' + e);
          }
        }
        fileReader.onerror = function(e) {
          alert('有错误发生，请再尝试一次\n' + e);
        };
        fileReader.readAsText(file);
      }, false);
      fileInput.click();
    },
    init: function() {
      this._sendSyncEvent('ready');
    },
    importFromSync: function(aID, aState) {
      if (this.batchUpdate) {
        return;
      }

      try {
        this.batchUpdate = this.BATCH_SYNC;
        this._importFromString(aState, aID);
      } catch(e) {
        // no need to retry with corrupt incoming data
        this.endBatchUpdate(aID);
      }
    },
    endBatchUpdate: function(aID) {
      switch(this.batchUpdate) {
        case this.BATCH_NONE:
          break;
        case this.BATCH_SYNC:
          this._sendSyncEvent('imported', aID);
          break;
        default:
          this._sendSyncEvent('update');
          break;
      }

      this.batchUpdate = this.BATCH_NONE;
    }
  };

  var Promo = {
    begin: undefined, //ASAP
    end: 1550592000000, //2019-02-19T16:00:00.000Z

    get inPromoWindow() {
      var inPromoWindow = true;
      var epoch = Date.now();
      if (this.begin && this.begin > epoch) {
        inPromoWindow = false;
      }
      if (this.end && this.end < epoch) {
        inPromoWindow = false;
      }
      delete this.inPromoWindow;
      return this.inPromoWindow = inPromoWindow;
    },
    get link() {
      delete this.link;
      return this.link = document.querySelector('#promo');
    },
    get userDisabled() {
      return NTabUtils.getPref('moa.ntab.promo.disabled', false) ||
             NTabUtils.getPref('moa.ntab.promo.p1902.disabled', false);;
    },
    set userDisabled(aVal) {
      NTabUtils.setPref('moa.ntab.promo.p1902.disabled', true);
      tracker.track({ type: 'promo', action: 'disable', sid: '201902' });
      document.location.reload();
    },
    
    handleEvent: function(evt) {
      switch (evt.type) {
        case 'click':
          evt.preventDefault();
          evt.stopPropagation();

          this.userDisabled = true;
          break;
        default:
          break;
      }
    },

    init: function() {
      this.updateLink(true);

      var closeButton = this.link.querySelector('button');
      closeButton.addEventListener('click', this, false);
    },

    updateLink: function(aIsInit) {
      if (this.userDisabled) {
        return;
      }

      if (!this.inPromoWindow) {
        return;
      }

      this.link.hidden = false;
    }
  };

  var SearchEngine = {
    engines: {
      'baidu_web': {
        href: 'https://www.baidu.com/index.php?tn=monline_3_dg',
        name: '百 度'
      },
      'google_web': {
        href: 'https://www.google.com/',
        name: '谷 歌'
      },
      'taobao_shopping': {
        href: 'https://ai.taobao.com/?pid=mm_28347190_2425761_13466329',
        name: '淘 宝'
      },
    },
    defaultEngine: 'baidu_web',

    get currentEngine() {
      var engine = NTabUtils.getPref('moa.ntab.search.engine', this.defaultEngine);
      if (Object.keys(this.engines).indexOf(engine) == -1) {
        engine = this.defaultEngine;
        engine = this.defaultEngine;
      }
      return engine;
    },
    set currentEngine(aEngine) {
      NTabUtils.setPref('moa.ntab.search.engine', aEngine);
    },
    get hideSearch() {
      return NTabUtils.getPref('moa.ntab.dial.hideSearch', false);
    },

    get searchForm() {
      delete this.searchForm;
      return this.searchForm = document.querySelector('#searchform');
    },
    get searchLink() {
      var selector = '#searchform > fieldset:first-of-type > a';

      delete this.searchLink;
      return this.searchLink = document.querySelector(selector);
    },
    get searchLogo() {
      var selector = '#searchform > fieldset:first-of-type > a > img';

      delete this.searchLogo;
      return this.searchLogo = document.querySelector(selector);
    },
    get engineChoice() {
      var selector = '#searchform > fieldset:last-of-type';

      delete this.engineChoice;
      return this.engineChoice = document.querySelector(selector);
    },

    init: function SearchEngine_init() {
      var self = this;
      Object.keys(this.engines).forEach(function(aEngine) {
        if (aEngine == self.defaultEngine) {
          return;
        }

        var label = document.createElement('label');

        var radio = document.createElement('input');
        radio.name = 'engine';
        radio.type = 'radio';
        radio.value = aEngine;
        label.appendChild(radio);

        var text = document.createTextNode(self.engines[aEngine].name);
        label.appendChild(text);

        self.engineChoice.appendChild(label);
        // extra whitespace
        self.engineChoice.appendChild(document.createTextNode(' '));
      });

      [].forEach.call(document.querySelectorAll('#searchform > fieldset > label > input[name="engine"]'), function(input) {
        input.addEventListener('click', function(evt) {
          self.currentEngine = evt.target.value;
        }, false);
      });

      this.update();
    },
    update: function SearchEngine_update() {
      this.searchForm.hidden = this.hideSearch;

      document.querySelector('#searchform > fieldset > label > input[value="' + this.currentEngine + '"]').checked = 'checked';

      var engine = this.engines[this.currentEngine];
      var logoName = {
        'google_web': 'google_web-444',
        'taobao_shopping': 'taobao_shopping-446'
      }[this.currentEngine] || this.currentEngine;
      this.searchLink.href = engine.href;
      this.searchLogo.src = '/static/img/search/' + logoName + '.png';
      this.searchLogo.alt = engine.name;
    }
  };

  var GeoIP = {
    filter: {
      '02': '2',
      '22': '22'
    },
    get region() {
      /*
       * localStorage is not available, use default: 22 -> filter -> 22
       * region is not set in localStorage, use default: 22 -> filter -> 22
       * region is set in localStorage, use region, convert others to 0
       */
      // return this.filter[NTabUtils.getPref('moa.ntab.dial.region', '22')] || '0';
      return '0';
    },
    set region(aRegion) {
      NTabUtils.setPref('moa.ntab.dial.region', aRegion);
    },

    handleEvent: function GeoIP_handleEvent(aEvt) {
      switch(aEvt.type) {
        case 'load':
          if (window.geoip_country_code && window.geoip_region) {
            if (geoip_country_code() == 'CN') {
              var region = geoip_region();
              if (region != '0') {
                GeoIP.region = region;
              }
            }
          }
          break;
      }
    },

    init: function GeoIP_init() {
      var script = document.createElement('script');
      script.src = 'https://api.firefoxchina.cn/geo/geo.js';
      script.addEventListener('load', this, false);
      document.head.appendChild(script);
    }
  };

  var NTab = {
    observer: {
      observe: function(aSubject, aTopic, aData) {
        if (aTopic == 'storage:changed') {
          switch (aData) {
            case 'moa.ntab.view':
              NTab.update();
              break;
            case 'moa.ntab.dial.hideSearch':
              Promo.updateLink();
              // intentionally no break;
            case 'moa.ntab.search.engine':
              SearchEngine.update();
              break;
            case 'moa.ntab.openLinkInNewTab':
              NTab.update();
              break;
            case 'moa.ntab.dial.column':
            case 'moa.ntab.dial.row':
            case 'moa.ntab.dial.useopacity':
              Grid.update();
              break;
            case 'moa.ntab.dial.refreshhack':
              Grid.update();
              break;
            case 'moa.ntab.backgroundcolor':
            case 'moa.ntab.backgroundimage':
            case 'moa.ntab.backgroundimagestyle':
            case 'moa.ntab.backgroundnoise':
              Background.update();
              break;
            case 'moa.ntab.displayfooter':
              Footer.update();
              break;
            case 'moa.ntab.dial.region':
              getLatestData('region');
              break;
            case null:
              // localStorage.clear, so update everything
              NTab.update();
              Grid.update();
              SearchEngine.update();
              Background.setBackgroundImage('');
              Promo.updateLink();
              Footer.update();
              break;
          }
          var itemPrefix = 'moa.ntab.dial.update.';
          if (aData && aData.indexOf(itemPrefix) == 0) {
            var index = aData.substring(itemPrefix.length);
            Grid.updateGridItem(index, false);
          }
        }
      }
    },
    get currentPane() {
      var pane = NTabUtils.getPref('moa.ntab.view', 'quickdial');
      if (['nav', 'quickdial', 'search', 'blank'].indexOf(pane) == -1) {
        pane = 'quickdial';
      }
      return pane;
    },
    set currentPane(aPane) {
      NTabUtils.setPref('moa.ntab.view', aPane);
      tracker.track({ type: 'view', action: 'switch', sid: aPane });
    },

    get body() {
      delete this.body;
      return this.body = document.body;
    },
    _paneInit: function Ntab__paneInit() {
      var self = this;
      [].forEach.call(document.querySelectorAll('#navpane > a'), function(anchor) {
        anchor.addEventListener('click', function(evt) {
          var targetPane = evt.target.getAttribute('data-pane');
          if (targetPane) {
            self.currentPane = targetPane;
          }
        }, false);
      });
      this.update(true);
    },
    _observerInit: function NTab__observerInit() {
      window.addEventListener('storage', this, false);
    },
    _observerUninit: function NTab__observerUninit() {
      window.removeEventListener('storage', this);
    },
    _updateSettingsDisplay: function NTab__updateSettingsDisplay() {
      [].forEach.call(document.querySelectorAll('#page-settings > fieldset > div > label > input[type="checkbox"]'), function(input) {
        input.checked = NTabUtils.getPref(input.getAttribute('data-pref'), !!JSON.parse(input.getAttribute('data-defaultval')));
      });
    },

    handleEvent: function NTab_handle(evt) {
      switch(evt.type) {
        case 'DOMContentLoaded':
          var self = this;
          quickDialModule.init(function() {
            self.init();
          });
          break;
        case 'unload':
          this.uninit();
          break;
        case 'storage':
          this.observer.observe(null, 'storage:changed', evt.key);
          break;
      }
    },
    init: function NTab_init() {
      DataBackup.init();
      //display first, then action
      Background.init();
      Grid.init();
      this._paneInit();
      //needs resizing after being shown
      Grid.resize();
      this._observerInit();
      SearchEngine.init();
      Footer.init();
      Launcher.init();
      Promo.init();
      GeoIP.init();
    },
    uninit: function NTab_uninit() {
      this._observerUninit();
    },
    update: function NTab_update(aInit) {
      this._updateSettingsDisplay();

      var pane = this.currentPane;
      this.body.className = pane;

      var openInNewTab = NTabUtils.getPref('moa.ntab.openLinkInNewTab', false);

      var base = document.querySelector('base');
      base.target = openInNewTab ? '_blank' : '';

      var iframe = document.getElementById(pane).querySelector('iframe');
      if (iframe && (pane != 'quickdial')) {
        var src_ = frameUrls[pane] || '';
        if (iframe.getAttribute('src') != src_) {
          NTabUtils.loadIFrame(iframe, src_);
        }
      }

      if (aInit) {
        tracker.track({ type: 'view', action: 'load', sid: pane });
      }

      var anchor = document.querySelector('footer > a');
      anchor.href = NTabUtils.getPref('moa.ntab.view.firefoxchina.url', 'https://home.firefoxchina.cn/?from=ntab_bottom');

      Grid.resize();
    },
  };

  var quickDialModule = {
    _db: null,
    _prefix: "moa.ntab.dial.update.",
    _cache: {},
    fillDefaults: false,

    get keys() {
      return Object.keys(this._cache);
    },

    _ensureStringIndex: function quickDialModule__ensureStringIndex(aIndex) {
      if (typeof(aIndex) == "number") {
        aIndex = aIndex.toString();
      }
      return aIndex;
    },

    refresh: function quickDialModule_refresh(aCallback) {
      var self = this;

      if (this._db) {
        this._cache = {};
        var tx = null;
        try {
          tx = this._db.transaction("quickdials");
        } catch(e) {
          if (e.name == "NotFoundError") {
            self.freshStart();
          }
          throw e;
        }
        var store = tx.objectStore("quickdials");
        logWithTime('o-cursor');
        var request = store.openCursor();
        var firstGot = true;
        request.onsuccess = function() {
          if (firstGot) {
            logWithTime('g-cursor');
            firstGot = false;
          }

          var cursor = request.result;

          if (cursor) {
            self.updateCachedDial(cursor.key, cursor.value, false);
            cursor.continue();
          } else {
            logWithTime('f-cursor');
            if (aCallback) {
              aCallback();
            }
          }
        };
      }
    },

    refreshSites: function quickDialModule_refreshSites(objectStoreName, onRow, onSuccess) {
      var self = this;

      if (this._db) {
        var tx = null;
        try {
          tx = this._db.transaction(objectStoreName);
        } catch(e) {
          if (e.name == "NotFoundError") {
            self.freshStart();
          }
          throw e;
        }

        var store = tx.objectStore(objectStoreName);
        var request = store.openCursor();
        request.onsuccess = function() {
          var cursor = request.result;

          if (cursor) {
            if (onRow) {
              onRow(cursor.key, cursor.value);
            }
            cursor.continue();
          } else {
            if (onSuccess) {
              onSuccess();
            }
          }
        };
      }
    },

    getCachedDial: function quickDialModule_getCachedDial(aIndex) {
      return this._cache[aIndex];
    },
    getDial: function quickDialModule_getDial(aIndex) {
      if (this._db) {
        aIndex = this._ensureStringIndex(aIndex);

        var tx = this._db.transaction("quickdials");
        var store = tx.objectStore("quickdials");
        return store.get(aIndex);
      }
    },
    getImage: function quickDialModule_getImage(aIndex) {
      if (this._db) {
        var tx = null;
        try {
          tx = this._db.transaction("images");
        } catch(e) {
          if (e.name == "NotFoundError") {
            self.freshStart();
          }
          throw e;
        }

        var store = tx.objectStore("images");
        return store.get(aIndex);
      }
    },
    updateCachedDial: function quickDialModule_updateCachedDial(aIndex, aDial, aNotify) {
      this._cache[aIndex] = aDial;
      if (aNotify) {
        localStorage.setItem(this._prefix + aIndex, Date.now());
        DataBackup.exportToSync();
      }
    },
    updateDefaultDials: function quickDialModule_updateDefaultDials(aData) {
      if (this._db) {
        var tx = null;
        try {
          tx = this._db.transaction("quickdials", "readwrite");
        } catch(e) {
          if (e.name == "NotFoundError") {
            self.freshStart();
          }
          throw e;
        }

        var store = tx.objectStore("quickdials");
        var index = store.index("defaultposition");

        var self = this;
        Object.keys(aData).forEach(function(aIndex) {
          aIndex = self._ensureStringIndex(aIndex);

          var r = index.getKey(aIndex);
          r.onsuccess = function() {
            var key = r.result;
            if (key) {
              var val = aData[aIndex];

              store.put(val, key);
            }
          };
        });
        return tx;
      }
    },
    updateSites: function quickDialModule_updateSites(objectStoreName, aData) {
      if (this._db) {
        var tx = this._db.transaction(objectStoreName, "readwrite");
        var store = tx.objectStore(objectStoreName);

        var self = this;
        Object.keys(aData).forEach(function(aIndex) {
          aIndex = self._ensureStringIndex(aIndex);

          store.put(aData[aIndex], aIndex);
        });
        return tx;
      }
    },
    updateDial: function quickDialModule_updateDial(aIndex, aDial) {
      if (this._db) {
        aIndex = this._ensureStringIndex(aIndex);

        var tx = this._db.transaction("quickdials", "readwrite");
        var store = tx.objectStore("quickdials");
        return store.put(aDial, aIndex);
      }
    },
    updateImage: function quickDialModule_updateImage(aIndex, aImage) {
      if (this._db) {
        var tx = this._db.transaction("images", "readwrite");
        var store = tx.objectStore("images");
        return store.put(aImage, aIndex);
      }
    },
    removeCachedDial: function quickDialModule_removeCachedDial(aIndex, aNotify) {
      delete this._cache[aIndex];
      if (aNotify) {
        localStorage.setItem(this._prefix + aIndex, Date.now());
        DataBackup.exportToSync();
      }
    },
    removeDial: function quickDialModule_removeDial(aIndex) {
      if (this._db) {
        aIndex = this._ensureStringIndex(aIndex);

        var tx = this._db.transaction("quickdials", "readwrite");
        var store = tx.objectStore("quickdials");
        return store.delete(aIndex);
      }
    },
    removeImage: function quickDialModule_removeImage(aIndex) {
      if (this._db) {
        var tx = this._db.transaction("images", "readwrite");
        var store = tx.objectStore("images");
        return store.delete(aIndex);
      }
    },
    confirmAndResetDials: function () {
      if (!confirm('警告：此操作将删除您已设置的快速拨号内容，是否继续？')) {
        return;
      }

      this.resetDials();
    },
    resetDials: function quickDialModule_resetDials(aData, aID) {
      aData = aData || defaultData;
      if (!aData) {
        getLatestData("resetDials");
        return;
      }

      if (!DataBackup.batchUpdate) {
        DataBackup.batchUpdate = DataBackup.BATCH_OTHER;
      }
      var error = function(aError) {
        DataBackup.batchUpdate = DataBackup.BATCH_NONE;
        throw aError;
      };

      if (this._db) {
        this.fillDefaults = false;

        var tx = null;
        try {
          tx = this._db.transaction("quickdials", "readwrite");
        } catch(e) {
          if (e.name == "NotFoundError") {
            self.freshStart();
          }
          error(e);
        }

        var store = tx.objectStore("quickdials");
        var request = store.clear();
        var self = this;
        request.onsuccess = function() {
          Object.keys(aData).forEach(function(aIndex) {
            aIndex = self._ensureStringIndex(aIndex);
            store.put(aData[aIndex], aIndex).onerror = error;
          });
        };
        request.onerror = error;
        tx.oncomplete = function() {
          self.refresh(function() {
            NTabUtils.setPref("moa.ntab.dial.refreshhack", Date.now());

            if (DataBackup.batchUpdate) {
              DataBackup.endBatchUpdate(aID);
            }
          });
        };
      } else {
        error(new Error("resetDials"));
      }
    },
    clearThumbnails: function quickDialModule_clearThumbnails() {
      if (this._db) {
        var tx = this._db.transaction("images", "readwrite");
        var store = tx.objectStore("images");
        var rB = store.get("background");
        rB.onsuccess = function() {
          var background = rB.result;

          var rc = store.clear();
          rc.onsuccess = function() {
            rpB = store.put(background, "background");
          }
        };
        return tx;
      }
    },
    exchangeDial: function quickDialModule_exchangeDial(aIndexA, aIndexB) {
      if (this._db) {
        aIndexA = this._ensureStringIndex(aIndexA);
        aIndexB = this._ensureStringIndex(aIndexB);

        var tx = this._db.transaction("quickdials", "readwrite");
        var store = tx.objectStore("quickdials");

        var rA = store.get(aIndexA);
        rA.onsuccess = function() {
          var dialA = rA.result;
          var rB = store.get(aIndexB);
          rB.onsuccess = function() {
            var dialB = rB.result;

            var rdA = store.delete(aIndexA);
            rdA.onsuccess = function() {
              var rpA = dialA ?
                        store.put(dialA, aIndexB):
                        store.delete(aIndexB);
              rpA.onsuccess = function() {
                if (dialB) {
                  store.put(dialB, aIndexA);
                }
              }
            }
          }
        }

        return tx;
      }
    },

    init: function quickDialModule_init(aCallback, aIsRetry) {
      var self = this;
      logWithTime('o-idb');

      var indexedDB = window.mozIndexedDB || window.indexedDB;
      if (!indexedDB) {
        var error = new TypeError("TypeError: indexedDB is " + indexedDB);
        reportError(error);
        fallbackToRO(error);
        return;
      }

      var request = indexedDB.open("offlintab", 5);

      request.onupgradeneeded = function(evt) {
        var db = request.result;

        switch (evt.oldVersion) {
          case 0:
            var qdStore = db.createObjectStore("quickdials");
            var defaultPositionIndex = qdStore.createIndex("defaultposition", "defaultposition", {unique: true});
            self.fillDefaults = true;
          case 1:
            var imgStore = db.createObjectStore("images");
          case 2:
            var siteFamousStore = db.createObjectStore("famoussites");
            var siteNewsStore = db.createObjectStore("newssites");
            var siteShoppingStore = db.createObjectStore("shoppingsites");
            var siteEntertainStore = db.createObjectStore("entertainsites");
            var siteImgStore = db.createObjectStore("sitesimages");
            var siteFrequentStore = db.createObjectStore("frequentsites");
          case 3:
            [
              "famoussites",
              "newssites",
              "shoppingsites",
              "entertainsites"
            ].forEach(db.deleteObjectStore.bind(db));
          case 4:
            db.deleteObjectStore("sitesimages");
          // intentionally no break;
          // case n:
          //   change sth. for version n + 1
        }
      };

      request.onblocked = function() {
        // some msg to close other open tabs
      };

      request.onsuccess = function() {
        logWithTime('g-idb');
        self._db = request.result;
        self._db.onversionchange = function() {
          self._db.close();
          self._db = null;
        };
        self._db.onerror = function(evt) {
          reportError(evt.target && evt.target.error);
          /*
           * might just be constraint error ?
           * self.freshStart();
           */
        };

        self.refresh(function() {
          if (self.keys.length) {
            aCallback();
          } else {
            aCallback();
            if (self.fillDefaults) {
              self.resetDials();
            } else {
              reportError(new Error("EmptyDials"));

              // fill defaults with an interval of one week
              var previous = NTabUtils.getPref("moa.ntab.dial.refreshhack", 0);
              if ((Date.now() - previous) > (7 * 86400e3)) {
                self.fillDefaults = true;
                self.resetDials();
              }
            }
          }
        });
      };

      request.onerror = function(evt) {
        var error = evt.target && evt.target.error;

        switch (error && error.name) {
          case "InvalidStateError":
            /*
             deleteDatabase will fail with InvalidStateError again
             */
            reportError(error);
            fallbackToRO(error);
            return;
          case "UnknownError":
            /*
             * Fx *sometimes* will delete corrupt db before fire UnknownError,
             * try openning it again, for once.
             */
            if (aIsRetry) {
              break;
            }

            self.init(aCallback, true);
            return;
        }

        reportError(error);
        self.freshStart();
      };
    },
    uninit: function quickDialModule_uninit() {
    },
    freshStart: function quickDialModule_freshStart() {
      var indexedDB = window.mozIndexedDB || window.indexedDB;
      var r = indexedDB.deleteDatabase("offlintab");
      r.onsuccess = function() {
        document.location.reload();
      };
      r.onerror = function(evt) {
        var error = evt.target && evt.target.error;
        reportError(error);
        fallbackToRO(error);
      };
    }
  };

  var WebChannel = {
    id: 0,

    handleData: function(aKey, aData) {
      switch (aKey) {
        case "variant.channel":
          getLastestDataForChannel(aData);
          break;
        case "bookmark.query":
        case "frequent.query":
        case "last.query":
          var type = aKey.split(".")[0];
          Overlay.createList(aData, type);
          break;
        case "thumbs.getThumbnail":
          Grid.gotImageFromExtension(aData);
          break;
        default:
          break;
      }
    },

    handleEvent: function(aEvt) {
      switch (aEvt.type) {
        case "DOMContentLoaded":
          this.registerElements();
          break;
        case "WebChannelMessageToContent":
          if (aEvt.detail.id !== window.mozCNChannel) {
            return;
          }

          this.handleData(aEvt.detail.message.key, aEvt.detail.message.data);
          break;
      }
    },

    registerElements: function() {
      var evt = new window.CustomEvent("mozCNUtils:Register", {
        detail: {
          subType: "defaultBrowser.maybeEnableSetDefaultBrowser",
          elements: {
            button: document.getElementById("setdefault")
          }
        }
      });
      window.dispatchEvent(evt);
    },

    send: function (aKey, aParameters) {
      this.id++;
      var detail = {
        id: window.mozCNChannel,
        message: {
          id: this.id,
          key: aKey,
          parameters: aParameters
        },
      };
      switch (window.mozCNChannel) {
        case "moz_cn_utils":
          break;
        default:
          detail = JSON.stringify(detail);
          break;
      }
      var evt = new window.CustomEvent("WebChannelMessageToChrome", {
        detail: detail,
      });
      window.dispatchEvent(evt);
    }
  };

  window.addEventListener('DOMContentLoaded', NTab, false);
  window.addEventListener('unload', NTab, false);
  window.addEventListener(DataBackup.evtType, DataBackup, false);
  if (window.mozCNChannel) {
    window.addEventListener('DOMContentLoaded', WebChannel, false);
    window.addEventListener('WebChannelMessageToContent', WebChannel, false);
  }
  window.addEventListener('message', function(aEvt) {
    if (aEvt.origin == "https://newtab.firefoxchina.cn") {
      try {
        tracker.track(JSON.parse(aEvt.data));
      } catch(e) {};
    }
  }, false);
  window.onerror = function(aMessage, aUrl, aLineNo, aColNo, aError) {
    var messages = aMessage.split(':', 2);

    reportError(aError || {
      name: messages[0],
      message: messages[1] && messages[1].trim(),
      lineNumber: aLineNo,
      fileName: aUrl
    });
  };
//})();
