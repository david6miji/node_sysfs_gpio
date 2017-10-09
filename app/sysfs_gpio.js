var
	inherits 			= require('util').inherits,
	fs					= require('fs'),

end_require= true;

const sysfs_base = '/sys/class/gpio/';
const OFF  = 0;
const ON   = 1;

sysfsGPIO = function(index){
	console.log( "create sysfsGPIO("+index+")" );
	this.index 		= index;
	this.path  		= sysfs_base + 'gpio' + index + '/';
	this.timer_id 	= undefined;
	this.count 		= 0;
	this.out_fd		= -1;

 	              this.remove_gpio()
 	.then(	() => this.append_gpio() )
 	.then(	() => this.output_mode_gpio() )
 	.then(	() => this.output_value_gpio( OFF ) )
 	.then(	() => this.open_out_gpio() )
	;

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

sysfsGPIO.prototype.disp_out = function (value) {
	if( value === OFF ) console.log( 'OFF : ' + this.index );
	else                console.log( 'ON  : ' + this.index );
}

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
			this.disp_out(value);

			resolve();
		});

	});
};

sysfsGPIO.prototype.open_out_gpio = function () {
	return new Promise( (resolve, reject) => {

		if( this.out_fd > -1 ) {
			fs.closeSync(this.fd)
		}

		fs.open( this.path + 'value', 'w', (err, fd) => {
			if (err) {
				console.log('opening out gpio['+this.index+'] is failed');
				console.log(err);
				reject(err);
				return;
			}
			this.out_fd = fd;
			console.log('opening out gpio['+this.index+'] is successed!');
			resolve();
		});
	});
};

sysfsGPIO.prototype.out = function (value) {

	if( this.out_fd < 0 ) return;

	fs.write( this.out_fd, String(value), (err) => {
		if (err) {
			console.log('out gpio['+this.index+'] is failed');
			console.log(err);
			return;
		}
		this.disp_out(value);

	});
};

sysfsGPIO.prototype.delay = function (msec) {
	return new Promise( (resolve, reject) => {
		setTimeout( function () {
			resolve();
		}, msec );
	});
};

sysfsGPIO.prototype.start_pulse = function(time,count) {
	return new Promise( (resolve, reject) => {
		if ( this.timer_id !== null ){
			clearInterval(this.timer_id);
		}
		this.count = count * 2;
		this.timer_id 	= setInterval( () => {
//			console.log( "CALL Timer gpio[" + this.index + "] " + this.count );
			this.out(this.count % 2);
			this.count--;
			if( this.count < 0 ) {
				clearInterval(this.timer_id);
				this.timer_id = undefined;
			}
		}, time );
		if( this.timer_id !== null ) 	resolve();
		else							reject("fail timer interval");
	});
};

sysfsGPIO.prototype.stop = function () {
	var self = this;

	console.log( 'CALL sysfsGPIO.stop('+this.index+')' );
	if ( this.timer_id !== null ){
		clearInterval(this.timer_id);
		this.timer_id = undefined;
	}
	
	this.count 		= 0;
	this.output_value_gpio( OFF );

	return self;
}


sysfsGPIO.prototype.test = function () {
	var self = this;

	console.log( 'CALL sysfsGPIO.test()' );

	this.start_pulse(1000,10);

	return self;
}

module.exports = sysfsGPIO;
