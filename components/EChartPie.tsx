import ReactECharts from 'echarts-for-react';

interface EChartProps {
  xAxis: string[]; // Les noms des articles
  series: { value: number; unit: string }[]; // Quantité avec unité
}

const EChartComponent = ({ xAxis, series }: EChartProps) => {
  const options = {
    tooltip: {
      trigger: 'item',
      formatter: (params: { name:string, value: number; dataIndex: number, percent:number }) =>
        `${params.name}: ${params.value} ${series[params.dataIndex].unit} (${params.percent}%)`, // Affiche la quantité, l'unité et le pourcentage
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: 'Article',
        type: 'pie',
        radius: '80%', // Contrôle la taille du graphique
        data: series.map((item, index) => ({
          value: item.value,
          name: xAxis[index],
          unit: item.unit,
        })),
        // label: {
        //   formatter: (params: any) =>
        //     `${params.name}\n${params.value} ${series[params.dataIndex].unit} (${params.percent}%)`, // Affiche la quantité, unité et pourcentage sur les segments
        // },
        itemStyle: {
          color: function (params: {dataIndex: number}) {
            const colorList = ['#5C7BD9', '#9FE080', '#ccaadd', '#EE6666', '#FFDC60'];
            return colorList[params.dataIndex % colorList.length];
          },
        },
      },
    ],
  };

  return <ReactECharts option={options} />;
};

export default EChartComponent;
