var 
	express 	= require('express'),
	router 		= express.Router(),
	sfg 		= require(__dirname + '/../sysfs_gpio'),
	
end_require= true;

// const 	FORWARD_GPIO_INDEX 	= 37;
// const 	BACKWARD_GPIO_INDEX = 36;
//  
// var gpio_forward 	= new sfg( FORWARD_GPIO_INDEX 	);
// var gpio_backward 	= new sfg( BACKWARD_GPIO_INDEX 	);

// var gpio_clean_up	= function(){
// 	console.log( "CALL gpio_clean_up()" );
// };

// process.on('exit'				, gpio_clean_up );
// process.on('SIGINT'				, gpio_clean_up );
// process.on('uncaughtException' 	, gpio_clean_up );

/* GET test  */
router.get('/', function(req, res, next) {
	
//	gpio_forward.test();
//	gpio_backward.test();
	
	res.send('ok test');
});

module.exports = router;
