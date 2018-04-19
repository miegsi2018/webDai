
var chart = null;
var dataPoints = [];

function chartContainer() {

chart = new CanvasJS.Chart("chartContainer", {
	animationEnabled: true,
	theme: "light1",
	title: {
        text: "Total de sensores ativos"
        
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
                

                label: "temperatura",

                y: 1,
                color: "#2196F3",

			},
			
			
            {
                

                label: "luz",

                y: 2,
                color: "#2196F3",

			},
			{
                

                label: "movimento",

                y: 2,
                color: "#2196F3",

			},
			{
                

                label: "fumo",

                y: 2,
                color: "#2196F3",

			},
			{
                

                label: "Outros",

                y: 2,
                color: "#2196F3",

            }]
	}]
});



	
    chart.render(); 
}