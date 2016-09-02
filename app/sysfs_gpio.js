var 
	inherits 			= require('util').inherits,
	fs					= require('fs'),

end_require= true;

const sysfs_base = '/sys/class/gpio/';

var append_gpio = function (index) {
	console.log('CALL append_gpio');

	return new Promise(function (resolve, reject) {
	console.log('P CALL append_gpio');
		fs.writeFile(sysfs_base + 'export', index, (err) => {
			if (err) {
				console.log('appending gpio['+index+'] is fail');
				console.log(err);
				reject(err);
			} else {	
				console.log('appending gpio['+index+'] is successed!');
				resolve();
			}
		});

	});
};

var remove_gpio = function (index) {
	console.log('CALL remove_gpio');

	return new Promise(function (resolve, reject) {
	console.log('P CALL remove_gpio');
		fs.writeFile(sysfs_base + 'unexport', index, (err) => {
			if (err) {
				if( err.code !== 'EINVAL' ) {
					console.log('remove gpio['+index+'] is fail');
					console.log(err);
					reject(err);
					return;
				} 
			}
			
			console.log('remove gpio['+index+'] is successed!');
			resolve();
		});

	});
};

var output_mode_gpio = function (path,index) {
	console.log('CALL output_mode_gpio');

	return new Promise(function (resolve, reject) {
	console.log('P CALL output_mode_gpio');

		console.log( path + 'direction' );
		fs.writeFile( path + 'direction', 'out', (err) => {
			if (err) {
				console.log('changing gpio['+index+'] mode to output is failed');
				console.log(err); 
				reject(err);
				return;
			}
			
			console.log('changing gpio['+index+'] mode to output is successed!');
			resolve();
		});

	});
};

var output_value_gpio = function (path,index,value) {
	console.log('CALL output_value_gpio');

	return new Promise(function (resolve, reject) {
	console.log('P CALL output_value_gpio');

		console.log( path + 'value' );
		fs.writeFile( path + 'value', value, (err) => {
			if (err) {
				console.log('writing  gpio['+index+'] = ' + value + '] is failed');
				console.log(err); 
				reject(err);
				return;
			}
			
			console.log('writing  gpio['+index+'] = ' + value + '] is successed!');
			resolve();
		});

	});
};


var delay = function (msec) {
	return new Promise( function (resolve, reject) {
		console.log( "CALL delay("+msec+")" );  
		setTimeout( function () {
			console.log( "CALL delay timeout");  
			resolve();
		}, msec );
	});
};

sysfsGPIO = function(index){
	console.log( "CALL sysfsGPIO("+index+")" );
	this.index = index;
	this.path  = sysfs_base + 'gpio' + index + '/';
	
 	             remove_gpio      (this.index)
 	.then(	p => append_gpio      (this.index) )
//	.then(  p => delay            ( 5000 ) )
 	.then(	p => output_mode_gpio (this.path, this.index) )
 	.then(	p => output_value_gpio (this.path, this.index , 0 ) );

};

sysfsGPIO.prototype.test = function () {
	var self = this;

	console.log( 'CALL sysfsGPIO.test()' );
	// 에러 처리를 나중에 추가 한다.

	return self;
}

	
module.exports = sysfsGPIO;

