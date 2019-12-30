const shell = require('shelljs')
exports.check = function(branchName, cb) {
	if (!shell.which('git')) {
		//向命令行打印git命令不可用的提示信息
		shell.echo('Sorry, this script requires git');
		cb && cb();
		//退出当前进程
		shell.exit(1);
	}
	var version = shell.exec('git branch -a --no-merged', function(code, stdout, stderr) {
		if (stderr) {
			console.log('Program stderr:', stderr);
			throw new Error(stderr);
		}
		// console.log('Exit code:', code);
		console.log('Program output:', stdout);
		let branchs = stdout.replace(/\r\n/, '\n').split('\n');
		let needMerge = branchs.some(item => {
			if (item.trim() === 'remotes/origin/' + branchName) {
				return true
			}
		})
		if (needMerge) {
			throw new Error('need merge branch:' + branchName)
		}
		cb && cb()
	});
}
