var
	express 	= require('express'),
	router 		= express.Router(),
	sfg 		= require(__dirname + '/../sysfs_gpio'),

end_require= true;

const 	FORWARD_GPIO_INDEX 	= 37;
const 	BACKWARD_GPIO_INDEX = 36;

var gpio_forward 	= new sfg( FORWARD_GPIO_INDEX 	);
var gpio_backward 	= new sfg( BACKWARD_GPIO_INDEX 	);

router.get('/stop', function(req, res, next) {

	gpio_forward.stop();
	gpio_backward.stop();

	res.send('ok stop');
});

router.get('/forward', function(req, res, next) {
	console.log( "req.query.time = ", req.query.time );
	console.log( "req.query.count = ", req.query.count );

	gpio_backward.stop();
	gpio_forward.start_pulse(req.query.time,req.query.count);

	res.send('ok forward');
});

router.get('/backward', function(req, res, next) {
	console.log( "req.query.time = ", req.query.time );
	console.log( "req.query.count = ", req.query.count );

	gpio_forward.stop();
	gpio_backward.start_pulse(req.query.time,req.query.count);

	res.send('ok backward');
});

router.get('/state', function(req, res, next) {

	var state = {};

	state.result 			= 'ok';
	state.forward_count 	= parseInt(gpio_forward.count/2);
	state.backward_count 	= parseInt(gpio_backward.count/2);

    res.json(state);

});

module.exports = router;
