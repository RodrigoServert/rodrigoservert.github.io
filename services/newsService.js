// Arrays de diferentes conjuntos de noticias
const newsGroups = [
    // Grupo 1
    {
        "news": [
            {
                "category": "Technology",
                "title": "Apple Unveils Revolutionary Apple Watch Ultra ⌚",
                "text": "Apple has released its latest wearable device, the Apple Watch Ultra, designed for extreme adventurers and outdoor enthusiasts. It boasts a larger display, advanced sensors, and a rugged design to withstand harsh conditions."
            },
            {
                "category": "Science",
                "title": "Breakthrough in Alzheimer's Research 🔬",
                "text": "Scientists have identified a new protein that may play a key role in the development of Alzheimer's disease, offering hope for future treatments."
            },
            {
                "category": "Arts",
                "title": "Immersive Van Gogh Exhibit Debuts 🎨",
                "text": "A groundbreaking art exhibition brings Vincent Van Gogh's masterpieces to life through digital projections, creating an immersive and multi-sensory experience."
            },
            {
                "category": "Culture",
                "title": "Ancient Egyptian Pyramid Unearthed ��️",
                "text": "Archaeologists have uncovered a previously unknown pyramid in Giza, providing insights into the ancient Egyptian civilization and its architectural prowess."
            },
            {
                "category": "Innovation",
                "title": "Self-Driving Cars Hit the Road 🚗",
                "text": "Tesla has begun rolling out beta testing of its fully autonomous driving system, marking a significant step towards the future of transportation."
            },
            {
                "category": "Environment",
                "title": "Climate Crisis Spurs Action 🌎",
                "text": "Following a series of devastating natural disasters, governments and organizations are ramping up efforts to address the urgent climate crisis."
            },
            {
                "category": "Sports",
                "title": "Nadal Triumphs at Roland Garros 🎾",
                "text": "Rafael Nadal has extended his historic record at the French Open, securing a record-breaking 15th title with a dominant performance in the final."
            },
            {
                "category": "Politics",
                "title": "Historic Peace Deal Signed 🕊️",
                "text": "After years of conflict, Israel and Palestine have reached a landmark peace agreement, hailed as a transformative moment in the Middle East."
            }
        ]
    },
    // Grupo 2
    {
        "news": [
            {
                "category": "Technology",
                "title": "Quantum Computing Breakthrough 💻",
                "text": "IBM announces a new quantum processor that achieves quantum advantage, solving complex calculations millions of times faster than traditional computers."
            },
            {
                "category": "Technology",
                "title": "Apple Unveils New iPhone 15 📱",
                "text": "Apple officially announced the much-anticipated iPhone 15, boasting advanced features including a new A17 Bionic chip and Dynamic Island display."
            },
            {
                "category": "Technology",
                "title": "SpaceX Launches Internet Satellites 🛰️",
                "text": "SpaceX successfully deploys another batch of Starlink satellites, expanding global internet coverage to remote areas worldwide."
            },
            {
                "category": "Technology",
                "title": "Revolutionary AI Technology 🤖",
                "text": "A new AI technology has been developed that can predict human behavior with unprecedented accuracy, revolutionizing the way we interact with technology."
            },
            {
                "category": "Science",
                "title": "New Species of Dinosaur Discovered 🦕",
                "text": "Scientists have discovered a new species of dinosaur, providing insights into the diversity of life on prehistoric Earth."
            },
            {
                "category": "Culture",
                "title": "Immersive Ancient Rome Exhibit 🌍",
                "text": "A groundbreaking exhibition brings the ancient Roman civilization to life through digital projections, creating an immersive and multi-sensory experience."
            },
            {
                "category": "Innovation",
                "title": "Self-Healing Materials 🔥",
                "text": "Researchers have developed self-healing materials that can repair themselves when damaged, offering a new approach to material science."
            },
            {
                "category": "Environment",
                "title": "Climate Change Impact on Biodiversity 🌿",
                "text": "Climate change is having a significant impact on biodiversity, with many species facing extinction due to changing habitats and food sources."
            }
        ]
    },
    // Grupo 3
    {
        "news": [
            {
                "category": "Technology",
                "title": "SpaceX Launches Internet Satellites 🛰️",
                "text": "SpaceX successfully deploys another batch of Starlink satellites, expanding global internet coverage to remote areas worldwide."
            },
            {
                "category": "Technology",
                "title": "Revolutionary AI Technology 🤖",
                "text": "Researchers have developed a new AI technology that can predict human behavior with unprecedented accuracy, revolutionizing the way we interact with technology."
            },
            {
                "category": "Technology",
                "title": "Quantum Computing Breakthrough 💻",
                "text": "IBM announces a new quantum processor that achieves quantum advantage, solving complex calculations millions of times faster than traditional computers."
            },
            {
                "category": "Technology",
                "title": "Apple Unveils Revolutionary Apple Watch Ultra ⌚",
                "text": "Apple has released its latest wearable device, the Apple Watch Ultra, designed for extreme adventurers and outdoor enthusiasts. It boasts a larger display, advanced sensors, and a rugged design to withstand harsh conditions."
            },
            {
                "category": "Science",
                "title": "New Species of Dinosaur Discovered 🦕",
                "text": "Scientists have discovered a new species of dinosaur, providing insights into the diversity of life on prehistoric Earth."
            },
            {
                "category": "Culture",
                "title": "Immersive Ancient Rome Exhibit 🌍",
                "text": "A groundbreaking exhibition brings the ancient Roman civilization to life through digital projections, creating an immersive and multi-sensory experience."
            },
            {
                "category": "Innovation",
                "title": "Self-Healing Materials 🔥",
                "text": "Researchers have developed self-healing materials that can repair themselves when damaged, offering a new approach to material science."
            },
            {
                "category": "Environment",
                "title": "Climate Change Impact on Biodiversity 🌿",
                "text": "Climate change is having a significant impact on biodiversity, with many species facing extinction due to changing habitats and food sources."
            }
        ]
    }
];

let currentGroupIndex = 0;

async function generateDailyNews() {
    // Rotar entre los grupos de noticias
    currentGroupIndex = (currentGroupIndex + 1) % newsGroups.length;
    return newsGroups[currentGroupIndex];
}

module.exports = { generateDailyNews }; 