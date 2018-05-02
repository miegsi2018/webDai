
var chart = null;
var dataPoints = [];

function chartContainer() {

chart = new CanvasJS.Chart("chartContainer", {
	animationEnabled: true,
	theme: "light1",
	title: {
        text: "Total de utilizadores"
        
    },
    axisY: {
		title: "",
		titleFontSize: 24
	},  
	data: [{
		indexLabelFontSize: 16,

        type: "column",
		yValueFormatString: "##0\" \"",
            indexLabel: " {y}",
            dataPoints: [{
                

                label: "Admin",

                y: totalUtilizadoresAdmin(),
                color: "#2196F3",

			},
			
			
            {
                

                label: "Users",

                y: totalUser(),
                color: "#2196F3",

			}]
	}]
});



	
    chart.render(); 
}