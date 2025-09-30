import discoverStyles from '../styles/discover.module.css';
import CardPage from '../Components/card'; 
import Navbar from '../Components/Navbar';


const opportunities = [
  {
    title: "AI Explorer",
    description: "Dive into the world of machine learning and shape the future of intelligence.",
  },
  {
    title: "Design Hacker",
    description: "Reimagine user experiences with bold colors, smooth UX, and wild creativity.",
  },
  {
    title: "Code Alchemist",
    description: "Turn caffeine into code and bugs into features. Push boundaries, not just commits.",
  },
  {
    title: "Data Whisperer",
    description: "Uncover hidden patterns and let the numbers tell their stories.",
  },
  {
    title: "Cloud Surfer",
    description: "Deploy, scale, and ride the waves of distributed systems like a pro.",
  },
  {
    title: "NeuroNaut",
    description: "Explore the neural networks of the brain and machine. One synapse at a time.",
  },
  {
    title: "NeuroNaut",
    description: "Explore the neural networks of the brain and machine. One synapse at a time.",
  },
    {
    title: "NeuroNaut",
    description: "Explore the neural networks of the brain and machine. One synapse at a time.",
  }
  ,  {
    title: "NeuroNaut",
    description: "Explore the neural networks of the brain and machine. One synapse at a time.",
  }
];


export default function Discover() {
  return (
    <div>
      <Navbar/>
      <div className= "grid">
      {opportunities.map((use, position) => (
        <CardPage key={position} opportunity={use} />
      ))}
    </div>
    </div>
  );
}





