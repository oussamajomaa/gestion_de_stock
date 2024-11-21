import ReactECharts from 'echarts-for-react';

interface EChartProps {
    xAxis: string[]; // Les données pour l'axe X
    series: { value: number; unit: string }[]; // Les données pour la série
  }

const EChartComponent = ({xAxis,series}:EChartProps) => {
  const options = {
    
    tooltip: {
        // trigger: 'item',
        // formatter: (params: any) =>
        //   `${params.name}: ${params.value} ${series[params.dataIndex].unit}`, // Affiche l'unité dans le tooltip
      },
    xAxis: {
      data: xAxis,
    },
    yAxis: {},
    series: [
      {
        name: 'Article',
        type: 'bar',
        data: series.map((item) => ({
            value: item.value, // Quantité
            unit: item.unit, // Unité associée
          })),
          label: {
            show: true,
            position: 'top', // Affiche les labels sur le dessus des barres
            formatter: (params: any) =>
              `${params.value} ${series[params.dataIndex].unit}`, // Label avec l'unité
          },
        itemStyle: {
            // Ajoutez les couleurs de fond ici
            color: function (params:any) {
                // Exemple de couleur personnalisée basée sur l'index de la barre
                const colorList = ['#5C7BD9', '#9FE080', '#bb0055', '#EE6666', '#FFDC60'];
                return colorList[params.dataIndex % colorList.length];
            }
        }
      },
    ],
  };

  return <ReactECharts option={options} />;
};

export default EChartComponent;
