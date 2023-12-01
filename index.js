let stronglyHesitantData = './data/hesitancyData.json';
let countyCoordinatesData = './data/county_coordinates.json';

let countyData;
let hesitancyData;

let canvas = d3.select('#canvas');
let tooltip = d3.select('#tooltip');

//fetching the data
d3.json(countyCoordinatesData).then(
    (data, error) => {
        if(error){
            console.log(log)
        }else{
            countyData = topojson.feature(data, data.objects.counties).features //converting to GeoJSON

            d3.json(stronglyHesitantData).then(
                (data, error) => {
                    if(error){
                        console.log(log)
                    }else{
                        hesitancyData = data
                        drawMap()
                    }
                }
            )
        }
    }
)

//drawMap function
let drawMap = () => {
 
    canvas.selectAll('path')
            .data(countyData)
            .enter()
            .append('path')
            .attr('d', d3.geoPath())
            .attr('class', 'county')
            .attr('fill', (countyDataItem) => {
                let id = countyDataItem['id']
                let county = hesitancyData.find((item) => {
                    return item['fips'] === id
                })
                let percentage = county['stronglyHesitant']
                if(percentage <= 4){
                    return 'LightCyan'
                }else if(percentage <= 7){
                    return 'PaleTurquoise'
                }else if(percentage <= 9){
                    return 'DarkTurquoise'
                }else if(percentage <= 13){
                    return 'Aquamarine'
                }else if(percentage <= 15){
                    return 'SteelBlue'
                }else{
                    return 'CadetBlue'
                }
            })
            .on('mouseover', (countyDataItem)=> {
                tooltip.transition()
                    .style('visibility', 'visible')

                let id = countyDataItem['id']
                let county = hesitancyData.find((item) => {
                    return item['fips'] === id
                })

                tooltip.text(county['fips'] + ' - ' + county['area_name'] + ', ' + 
                    county['state'] + ' : ' + county['stronglyHesitant'] + '%')
            })
            .on('mouseout', (countyDataItem) => {
                tooltip.transition()
                    .style('visibility', 'hidden')
            })
}

