var 
	inherits 			= require('util').inherits,
	fs					= require('fs'),

end_require= true;

const sysfs_base = '/sys/class/gpio/';
const OFF  = 0;
const ON   = 1;


sysfsGPIO = function(index){
	console.log( "create sysfsGPIO("+index+")" );
	this.index = index;
	this.path  = sysfs_base + 'gpio' + index + '/';
	
 	              this.remove_gpio()
 	.then(	() => this.append_gpio() )
 	.then(	() => this.output_mode_gpio() )
 	.then(	() => this.output_value_gpio( OFF ) );

};

sysfsGPIO.prototype.remove_gpio = function () {
	return new Promise( (resolve, reject) => {
		fs.writeFile(sysfs_base + 'unexport', this.index, (err) => {
			if (err) {
				if( err.code !== 'EINVAL' ) {
					console.log('remove gpio['+this.index+'] is fail');
					console.log(err);
					reject(err);
					return;
				} 
			}
			console.log('remove gpio['+this.index+'] is successed!');
			resolve();
		});

	});
};

sysfsGPIO.prototype.append_gpio = function () {
	return new Promise( (resolve, reject) => {
		fs.writeFile(sysfs_base + 'export', this.index, (err) => {
			if (err) {
				console.log('appending gpio['+this.index+'] is fail');
				console.log(err);
				reject(err);
			} else {	
				console.log('appending gpio['+this.index+'] is successed!');
				resolve();
			}
		});
	});
};

sysfsGPIO.prototype.output_mode_gpio = function () {
	return new Promise( (resolve, reject) => {
		fs.writeFile( this.path + 'direction', 'out', (err) => {
			if (err) {
				console.log('changing gpio['+this.index+'] mode to output is failed');
				console.log(err); 
				reject(err);
				return;
			}
			console.log('changing gpio['+this.index+'] mode to output is successed!');
			resolve();
		});

	});
};

sysfsGPIO.prototype.output_value_gpio = function (value) {
	return new Promise( (resolve, reject) => {
		fs.writeFile( this.path + 'value', value, (err) => {
			if (err) {
				console.log('writing  gpio['+this.index+'] = ' + value + '] is failed');
				console.log(err); 
				reject(err);
				return;
			}
			console.log('writing  gpio['+this.index+'] = ' + value + '] is successed!');
			resolve();
		});

	});
};

sysfsGPIO.prototype.delay = function (msec) {
	return new Promise( function (resolve, reject) {
		setTimeout( function () {
			resolve();
		}, msec );
	});
};




sysfsGPIO.prototype.test = function () {
	var self = this;

	console.log( 'CALL sysfsGPIO.test()' );

	return self;
}

	
module.exports = sysfsGPIO;

