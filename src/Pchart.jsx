import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Doughnut, Line } from "react-chartjs-2";
import './styles/dashboard.css';
import './components/card.css';
import { data } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);
function Pchart({bucket , totalP,totalC,totalF,targetP}){
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: 'rgba(255,255,255,0.75)', boxWidth:12, padding:16 } },
      tooltip: { backgroundColor: 'rgba(10,10,10,0.9)', titleColor:'#fff', bodyColor:'#e6eef8' }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.6)' } },
      y: { grid: { color: 'transparent' }, ticks: { color: 'rgba(255,255,255,0.6)' } }
    },
    elements: { point: { radius: 3 }, line: { tension: 0.35 } }
  };
const barData={
    labels:["Proteins" , "Calories"],
    datasets:[
      {
        label:"Total",
        data:[totalP,totalC],
        backgroundColor: ['rgba(59,231,167,0.12)','rgba(85,230,255,0.12)'],
        borderColor: ['rgba(59,231,167,0.9)','rgba(85,230,255,0.9)'],
        borderWidth: 1,
      },
    ]
}
const douData={
  labels:["Protein" , "Calories" , "Fat"],
  datasets:[
    {
      label:"Total",
      data:[totalP,totalC,totalF],
      backgroundColor: [
        'rgba(59,231,167,0.9)',
        'rgba(255,155,74,0.9)',
        'rgba(85,230,255,0.9)'
      ],
      hoverOffset: 6,
    }
  ]

}

const Remaining=Math.max(targetP-totalP,0);
const consumed=totalP;

const lData={
  labels:["Achived","Remaining"],
  datasets:[{
     data:[consumed,Remaining],
      backgroundColor: [
        "rgba(59,231,167,0.95)",
        "rgba(255,255,255,0.08)"
        
      ],
      borderWidth: 2,
      cutout: "75%",

       borderColor: [
      "rgba(59,231,167,1)",   // border for Achieved
      "rgba(255,255,255,0.2)" // border for Remaining
    ],
    
      
  }]
}


  return (
<div className="ft-chart-wrap">
  <div className="ft-card ft-chart fade-in">
    <Doughnut data={douData} options={options} />
  </div>

  <div className="ft-card ft-chart fade-in">
    
    <Doughnut data={lData} options={options} />
  </div>
</div>
  )
}

export default Pchart;