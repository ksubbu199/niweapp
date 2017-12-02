var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var request = require('request');
router.get('/search',function(req,res){
  var q=req.query.q;
  request('http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?f=json&maxSuggestions=6&text='+q,function(err,resp,body){
    res.setHeader('Content-Type', 'application/json');
    res.send(body);
  });
});

router.get('/searchPlaces',function(req,res){
  var q=req.query.q;
  request('http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?f=json&maxSuggestions=6&text='+q,function(err,resp,body){
    if(err) return;
    res.render('places',JSON.parse(body));
  });
})

router.post('/getDetails',function(req,res){
  var place=req.body.place;
  var key=req.body.magicKey;
  request('http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine='+place+'&f=json&outFields=Addr_type,Match_addr,StAddr,City&magicKey='+key+'&maxLocations=6',function(err,resp,body){
    if(err) return;
    var body = JSON.parse(body);
    var extent=body.candidates[0].extent;
    var spatialReference = body.spatialReference;
    extent.spatialReference = spatialReference;
    var stringExtent= JSON.stringify(extent);
    request('http://14.139.172.6:6080/arcgis/rest/services/Solar_Radiation_Map_of_India/MapServer/5/query?f=json&returnGeometry=true&spatialRel=esriSpatialRelIntersects&maxAllowableOffset=38&geometry='+stringExtent+'&geometryType=esriGeometryEnvelope&inSR=102100&outFields=*&outSR=102100',function(error,respo,budy){
      res.setHeader('Content-Type', 'application/json');
      res.send(budy);

    })

  })

});
module.exports = router;
