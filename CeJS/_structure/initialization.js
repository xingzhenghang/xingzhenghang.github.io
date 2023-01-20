/**
 * <code>

 additional initialization of library.

 TODO
 //setTool(),oldVadapter();	//	当用此档debug时请执行此行


 利用.js加上此段与init()，以及.hta（<script type="text/javascript" src="~.js"></script>），可造出 GUI / none GUI 两种可选择之介面。
 if(typeof args==='object')init();else window.onload=init;
 </code>
 */

// args.append(['turnCode.js']);
// args=args.concat(['turnCode.js']);
// --------------------------------------------------------------------------------------------------------------------
// 不作 initialization
// CeL.no_initialization = false;
if (typeof CeL === 'function' && !CeL.no_initialization) {
	if (CeL.env.script_name === CeL.env.main_script_name)
		// 仅仅执行 ce.js 此档时欲执行的程序。
		(function(_) {

			// WScript.Echo(_.env.script_name);
			// _.debug(_.env.script_name);

			// _.set_debug(2);
			_
					.run([ 'application.OS.Windows',
							'application.OS.Windows.registry' ]);
			// _.debug(_.reg);
			if (!_.reg) {
				// 会到这边，表示所有可用的 path 都无法利用；
				// registry 的 path，或是本 include 的附属 module 都有问题。
				// 像是 library base 造成的问题，不该出现于此。
				WScript.Echo('无法载入 module，您可能需要手动检查 registry，看看是否设定到了错误的路径？');
				return;
			}

			// 将 path 写入 registry
			var path_key_name = _.env.registry_path_key_name,
			// 此时 script 即为 main_script
			library_base_path = _.env.script_base_path, path_in_registry = _.reg
					.getValue(path_key_name)
					|| '(null)';
			// WScript.Echo('registry:\n' + path_in_registry + '\npath now:\n' +
			// library_base_path);
			if (path_in_registry !== library_base_path) {
				// 执行程式之 path 与 registry 所列 path 不同，且 registry 所列 path 有问题或不被使用。
				// registry 所列 path !== 执行程式之 path
				// Change library base path.
				WScript
						.Echo('Change the base path of [' + _.Class
								+ '] from:\n' + path_in_registry + '\n to\n'
								+ library_base_path + '\n\nkey name:\n'
								+ path_key_name);
				_.reg.setValue.cid = 1;
				_.reg.setValue(path_key_name, library_base_path, 0, 0, 1);
				_.reg.setValue(_.env.registry_base + 'main_script',
						library_base_path + _.env.script_name
								+ _.env.script_extension, 0, 0, 1);
				_.reg.setValue.cid = 0;
			}

			// TODO
			// 拖曳档案到本档案上面时之处置。
			// initialization_WScript_Objects();
			if (
			// args instanceof Array
			typeof args === 'object') {
				// getEnvironment();
				// alert('Get arguments ['+args.length+']\n'+args.join('\n'));
				if (args.length) {
					var i = 0, p, enc, f, backupDir = dBasePath('kanashimi\\www\\cgi-bin\\program\\log\\');
					if (!fso.FolderExists(backupDir)) {
						try {
							fso.CreateFolder(backupDir);
						} catch (e) {
							backupDir = dBasePath('kanashimi\\www\\cgi-bin\\game\\log\\');
						}
					}
					if (!fso.FolderExists(backupDir)) {
						try {
							fso.CreateFolder(backupDir);
						} catch (e) {
							if (2 === alert('无法建立备份资料夹[' + backupDir
									+ ']！\n接下来的操作将不会备份！', 0, 0, 1 + 48))
								WScript.Quit();
							backupDir = '';
						}
					}
					// addCode.report=true; // 是否加入报告
					for (; i < args.length; i++) {
						if ((f = parse_shortcut(args[i], 1))
								.match(/\.(js|vbs|hta|[xs]?html?|txt|wsf|pac)$/i)
								&& isFile(f)) {
							p = alert(
									'是否以预设编码['
											+ ((enc = autodetectEncode(f)) === simpleFileDformat ? '内定语系('
													+ simpleFileDformat + ')'
													: enc) + ']处理下面档案？\n' + f,
									0, 0, 3 + 32);
							if (p === 2)
								break;
							else if (p === 6) {
								if (backupDir)
									fso.CopyFile(f, backupDir + getFN(f), true);
								addCode(f);
							}
						}
					}
				} else if (1 === alert('We will generate a reduced ['
						+ _.env.script_name + ']\n  to [' + _.env.script_name
						+ '.reduced.js].\nBut it takes several time.', 0, 0,
						1 + 32))
					reduceScript(0, _.env.script_name + '.reduced.js');
			}// else window.onload=init;

			// _._iF=undefined;

		})(CeL);
}

// test WinShell
// http://msdn.microsoft.com/en-us/library/bb787810(VS.85).aspx
if (false) {
	alert(WinShell.Windows().Item(0).FullName);

	var i, cmd, t = '', objFolder = WinShell.NameSpace(0xa), objFolderItem = objFolder
			.Items().Item(), colVerbs = objFolderItem.Verbs(); // 假如出意外，objFolder==null
	for (i = 0; i < colVerbs.Count; i++) {
		t += colVerbs.Item(i) + '\n';
		if (('' + colVerbs.Item(i)).indexOf('&R') != -1)
			cmd = colVerbs.Item(i);
	}
	objFolderItem.InvokeVerb('' + cmd);
	alert('Commands:\n' + t);

	// objShell.NameSpace(FolderFrom).CopyHere(FolderTo,0); // copy folder
	// objFolderItem=objShell.NameSpace(FolderFrom).ParseName("clock.avi");objFolderItem.Items().Item().InvokeVerb([动作]);
	// objShell.NameSpace(FolderFromPath).Items.Item(mName).InvokeVerb();

	// Sets or gets the date and time that a file was last modified.
	// http://msdn.microsoft.com/en-us/library/bb787825(VS.85).aspx
	// objFolderItem.ModifyDate = "01/01/1900 6:05:00 PM";
	// objShell.NameSpace("C:\Temp").ParseName("Test.Txt").ModifyDate =
	// DateAdd("d", -1, Now()) CDate("19 October 2007")

	// Touch displays or sets the created, access, and modified times of one
	// or more files. http://www.stevemiller.net/apps/
}

// 测试可写入的字元:0-128,最好用1-127，因为许多编辑器会将\0转成' '，\128又不确定
if (false) {
	var t = '', f = 'try.js', i = 0;
	for (; i < 128; i++)
		t += String.fromCharCode(i);
	if (simpleWrite(f, t))
		alert('Write error!\n有此local无法相容的字元?');
	else if (simpleRead(f) != t)
		alert('内容不同!');
	else if (simpleWrite(f, dQuote(t) + ';'))
		alert('Write error 2!\n有此local无法相容的字元?');
	else if (eval(simpleRead(f)) != t)
		alert('eval内容不同!');
	else
		alert('OK!');
}
