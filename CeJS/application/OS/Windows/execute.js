/**
 * @name CeL function for executing program
 * @fileoverview 本档案包含了 executing program 的 functions。
 * @since
 */

'use strict';
// 'use asm';

// --------------------------------------------------------------------------------------------

// 不采用 if 陈述式，可以避免 Eclipse JSDoc 与 format 多缩排一层。
typeof CeL === 'function' && CeL.run({
	// module name
	name : 'application.OS.Windows.execute',

	require : 'application.OS.Windows.new_COM'
	//
	+ '|application.OS.Windows.is_COM',

	// 设定不汇出的子函式。
	// no_extend : '*',

	// 为了方便格式化程式码，因此将 module 函式主体另外抽出。
	code : module_code
});

function module_code(library_namespace) {

	// requiring
	var new_COM = this.r('new_COM'), is_COM = this.r('is_COM');

	/**
	 * null module constructor
	 * 
	 * @class executing program 的 functions
	 */
	var _// JSDT:_module_
	= function() {
		// null module constructor
	};

	/**
	 * for JSDT: 有 prototype 才会将之当作 Class
	 */
	_// JSDT:_module_
	.prototype = {};

	/**
	 * @see also: application.OS.Windows.file.show_in_file_manager()
	 * 
	 * <code>

	 2008/8/8 18:29:44
	 run them with administrator rights	runs under administrator privileges.
	 帐户控制	Windows Vista：使用软体限制原则对抗未授权的软体	http://www.microsoft.com/taiwan/technet/windowsvista/security/rstrplcy.mspx
	 http://4sysops.com/archives/vista%E2%80%99s-uac-how-to-elevate-scripts-vbscript-and-jscript/
	 http://blogs.msdn.com/aaron_margosis/archive/2007/07/01/scripting-elevation-on-vista.aspx
	 Software\Microsoft\Windows\CurrentVersion\Policies\System\EnableLUA	c:\windows\system32\control.exe /name Microsoft.UserAccounts	http://www.dashken.net/index.php?/archives/280-VBScript-Check-if-OS-is-Vista-and-Vistas-UAC-status.html
	 http://msdn.microsoft.com/en-us/magazine/cc163486.aspx
	 HKEY_LOCAL_MACHINESOFTWARE MicrosoftWindowsCurrentVersionPoliciesSystem\ConsentPromptBehaviorAdmin	http://hsu.easynow.com.tw/index.php?load=read&id=28
	 http://vistavitals.blogspot.com/2008/02/logon-scripts-token-effort.html
	 runas	http://www.merawindows.com/Forums/tabid/324/forumid/82/postid/32458/scope/posts/Default.aspx
	 http://www.winhelponline.com/articles/185/1/VBScripts-and-UAC-elevation.html

	 http://forums.techarena.in/vista-security/654643.htm
	 Set objShell = CreateObject("Shell.Application")
	 Set objFolder = objShell.Namespace("C:\")
	 Set objFolderItem = objFolder.ParseName("myhta.hta")
	 objFolderItem.InvokeVerb "runas"

	 var WinShell=new ActiveXObject("Shell.Application"),p=location.pathname.replace(/[^\\]+$/,''),o=WinShell.Namespace(p).ParseName(location.pathname.slice(p.length));
	 o.InvokeVerb("runas");

	 http://www.zaoxue.com/article/tech-28339_2.htm	http://www.lob.cn/vbs/20071126203237.shtml

	 TODO:
	 对 prompt 回应不允许时的处理: 若想在受限的情况下使用?
	 不使用自订程式	http://msdn.microsoft.com/en-us/library/bb776820(VS.85).aspx
	 有时执行完就无消息，得多执行几次。
	 </code>
	 */
	function runas(path) {
		if (!path)
			path = typeof WScript === 'object' ? WScript.ScriptFullName
					: unescape(location.pathname);
		var host = {
			js : 'wscript.exe',
			vbs : 'wscript.exe',
			hta : 'mshta.exe'
		}, extension = path.match(/([^.]+)$/);
		host = extension && ((extension = extension[1].toLowerCase()) in host) ? host[extension]
				: '';
		// 判断是否有权限
		if (!registryF.checkAccess('HKLM\\SOFTWARE\\')) {
			// 以管理者权限另外执行新的.
			// It will get the UAC prompt if this feature is not disabled.
			new ActiveXObject("Shell.Application").ShellExecute(host || path,
					host ? path : '', '', 'runas'/* ,5 */);
			// 执行完本身则退出: bug: 有时执行完就无消息，得多执行几次。
			if (typeof WScript === 'object')
				WScript.Quit();
			else if (typeof window === 'object')
				window.close();
		}
	}

	// run_command[generateCode.dLK]='initialization_WScript_Objects';
	/**
	 * 执行 command。<br />
	 * JScript file: check owner, .exe file.<br />
	 * 
	 * TODO:<br />
	 * run_command([path, Verb],3): use Shell.Application InvokeVerb<br />
	 * run_command([path, arg1, arg2,..]): use Shell.Application.ShellExecute<br />
	 * set timeout.<br />
	 * cd. WshShell.Run('%COMSPEC% /K ' + ドライブ +' | cd /D '+ パス);// cd
	 * で他ドライブへ移れないので。
	 * 
	 * @example <code>

	//	usage:

	//	use <a href="http://msdn.microsoft.com/en-us/library/ateytk4a.aspx" accessdate="2012/11/7 18:30" title="Exec Method (Windows Script Host)">WshShell.Exec</a>,
	//	return [ExitCode, StdOut, StdErr].
	run_command(command);

	//	use <a href="http://msdn.microsoft.com/en-us/library/ateytk4a.aspx" accessdate="2012/11/7 18:30" title="Exec Method (Windows Script Host)">WshShell.Exec</a>,
	//	run callback.call(WshScriptExec Object, ExitCode, StdOut, StdErr) when done.
	run_command(command, function callback(){});

	//	use <a href="http://msdn.microsoft.com/en-us/library/d5fk67ky.aspx" accessdate="2012/11/7 18:30" title="Run Method (Windows Script Host)">WshShell.Run</a>
	run_command([strCommand, [intWindowStyle 0-10], [bWaitOnReturn false: nowait & return 0, true: wait & return error code]]);

	//	use WshRemote
	run_command(script path, remote computer)

	//	use WMI
	run_command(command, remote computer)

	 * </code>
	 * 
	 * @param {String}command
	 * @param {Function|String}[option]
	 * @param {String}remoteserver
	 * @returns
	 * 
	 * @see <a
	 *      href="http://www.microsoft.com/taiwan/technet/scriptcenter/resources/qanda/nov04/hey1115.mspx">我能使用指令码锁定工作站吗？</a>
	 */
	function run_command(command, callback, remoteserver) {
		library_namespace.debug('Run command: [' + command + ']', 1,
				'run_command');
		var process;
		try {
			if (!remoteserver)
				if (is_COM(process = new_COM('WScript.Shell')))

					if (Array.isArray(command)) {
						// WshShell.Run(command, [WindowStyle 0-10],
						// [WaitonReturn false: nowait & return 0, true: wait &
						// return error code])
						library_namespace.debug('using WshShell.Run()', 2);

						// return process.Run.apply(null, command);

						var length = command.length;
						return length > 2 ? process.Run(command[0], command[1],
								command[2]) :
						//
						length > 1 ? process.Run(command[0], command[1]) :
						//
						process.Run(command[0]);

						if (typeof callback === 'function')
							callback();
					}

					else {
						// WshShell.Exec(), objFolderItem.InvokeVerb()
						library_namespace.debug('using WshShell.Exec()', 2);

						process = process.Exec(command);
						// 预防要输入密码。
						process.StdIn.Close();
						if (typeof WScript !== 'object') {
							if (typeof callback === 'function')
								run_command.waiting.call({
									StdOut : [],
									StdErr : []
								}, process, callback);
							return;
						}
						while (process.Status === 0)
							WScript.Sleep(100);

						if (typeof callback === 'function')
							callback.call(process, process.ExitCode,
									process.StdOut.ReadAll(), process.StdErr
											.ReadAll());
						else
							return [ process.ExitCode,
									process.StdOut.ReadAll(),
									process.StdErr.ReadAll() ];
					}

				else {
					library_namespace.error('No COM get!');
					return;
				}

			if (/^[^ ]+\.(js|vbs)$/i.test(command)
					&& is_COM(process = new_COM('WSHController'))) {
				process = process.CreateScript(command, remoteserver);
				// TODO
				// http://msdn.microsoft.com/en-us/library/d070t67d(v=vs.84).aspx
				process.Execute();

				// <a
				// href="http://msdn.microsoft.com/en-us/library/9z4dddwa.aspx"
				// accessdate="2012/11/7 18:55">Status Property (WshRemote)</a>.
				// [NoTask, Running, Finished]
				while (process.Status !== 2)
					WScript.Sleep(100);
				return callback.call(process);
			}

			// TODO
			process = GetObject("winmgmts:{impersonationLevel=impersonate}//"
					+ (remoteserver || '.') + "/root/cimv2:Win32_Process");
			if (false)
				if (/^[^ ]+\.(j|vb)s$/i.test(command))
					command = "wscript.exe " + command;
			// Create 方法会让这个指令码在「远端电脑」上执行。
			return process.Create(command/* , null, null, intProcessID */);

		} catch (e) {
			library_namespace.error(e);
			return e;
		} finally {
			process = null;
		}
	}

	// <a href="http://msdn.microsoft.com/en-us/library/2f38xsxe.aspx"
	// accessdate="2012/11/8 18:47">WshScriptExec Object</a>
	run_command.waiting = function(process, callback) {
		// <a
		// href="http://us.generation-nt.com/answer/wsh-exec-hangs-getting-stdout-readall-command-line-winzip-help-59169522.html"
		// accessdate="2012/11/8 19:12">Answer : Wsh.exec hangs getting
		// StdOut.ReadAll from command line Winzip</a>.
		// <a href="http://support.microsoft.com/kb/960246"
		// accessdate="2012/11/8 19:44">Hang When Reading StdErr/StdOut
		// Properties of WshScriptExec Object</a>
		// 因为 <a href="http://msdn.microsoft.com/en-us/library/312a5kbt.aspx"
		// accessdate="2012/11/8 19:32">TextStream Object</a> 的 buffer size
		// limit 为 4KB，超过后 .ReadAll() 便会 hangs (deadlock)，因为 .ReadAll() 会等
		// EndOfStream character。只好尽可能快点读出。
		// 当程式输出过快时，仍可能来不及读，只能使用 output 至档案的方法。
		while (!process.StdOut.AtEndOfStream)
			this.StdOut.push(process.StdOut.Read(4096));
		while (!process.StdErr.AtEndOfStream)
			this.StdErr.push(process.StdErr.Read(4096));

		library_namespace.debug('process status: [' + process.Status
				+ ']<br />\nStdOut: [' + this.StdOut + '],<br />\nStdErr: ['
				+ this.StdErr + ']', 3, 'run_command.waiting');

		if (process.Status === 0) {
			// The job is still running.
			// DoEvent.
			// TODO: set timeout.
			setTimeout(run_command.waiting.bind(this, process, callback), 0);
			return;
		}

		try {
			library_namespace.debug('run callback [' + callback + '].', 3,
					'run_command.waiting');
			// if (typeof callback === 'function')
			callback.call(process, process.ExitCode, this.StdOut.join(''),
					this.StdErr.join(''));
		} catch (e) {
			library_namespace
					.warn('run_command.waiting: fault to run callback ['
							+ callback + '].');
			library_namespace.error(e);
		} finally {
			process = null;
		}
	};

	// Unicode pipe
	run_command.Unicode = function(command, callback, remoteserver) {
		command = '%COMSPEC% /U /C "' + command + '"';
		return run_command(command, callback, remoteserver);
	};
	_.run_command = run_command;

	return (_// JSDT:_module_
	);
}
