import CO2_GDPdata from '../static/CO2_GDPdata.csv'    // import dataset
"use strict";     // the code should be executed in "strict mode".
                  // With strict mode, you can not, for example, use undeclared variables

var datapoints = [];   // used to store data later
var filtered = [];
var SortedGDP2 = [];

//var sortedGDP = CO2_GDPdata
 //.filter(d => d['Country'] == 'High income' || d['Country'] == 'Low income' || d['Country'] == 'Upper middle income' || d['Country'] == 'Lower middle income')

//console.log(CO2_GDPdata)


const options = {
  config: {
    // Vega-Lite default configuration
  },
  init: (view) => {
    // initialize tooltip handler
    view.tooltip(new vegaTooltip.Handler().call);
  },
  view: {
    // view constructor options
    // remove the loader if you don't want to default to vega-datasets!
    //   loader: vega.loader({
    //     baseURL: "",
    //   }),
    renderer: "canvas",
  },
};

vl.register(vega, vegaLite, options);

// Again, We use d3.csv() to process data
d3.csv(CO2_GDPdata).then(function(data) {
  data.forEach(function(d){
    datapoints.push(d);
    if (d.Country == 'High income' ||
	d.Country == 'Low income' ||
	d.Country == 'Lower middle income' ||
	d.Country == 'Upper middle income') {
       filtered.push(d);
     }
  });

  SortedGDP2 = filtered.map((d) => {
	return { Country:d.Country, Year: +d.Year, CO2: +d.CO2, GDP: +d.GDP };
  });

  drawPlotVegaLite();
});


function drawPlotVegaLite() {
  const selection = vl.selectSingle('Sorted Income')
   .fields('Country','Year')         
   .init({Country: 'Low income', Year: '1960'})  
   .bind({Country: vl.menu(['Low income','High income','Upper middle income','Lower middle income']),Year: vl.slider(1960,2016,1)});


    // Nothing changed below
    return vl.markPoint({filled:true})
   .data(SortedGDP2)
   .select(selection)
   .encode(
     vl.color().if(selection, vl.value('green')).value("gray"),
     vl.x().fieldQ('GDP'),
     vl.y().fieldQ('CO2'),
     vl.opacity().if(selection).value(0.1),
     vl.tooltip().fieldQ('Year'),
     vl.size().value(100)
   )
   .width(450)
   .height(450)
   .render()
   .then(viewElement => {
	document.getElementById('view').appendChild(viewElement);
  });
}
