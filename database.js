// database.js - The Master List of Games

export const allGames = [
    // GAME 1: The Demo
    {
        id: "game-001",
        title: "Quantam Quest",
        type: "educational", // options: game, simulation, educational
        publisher: "Admin",
        description: "A Quantam based Game.",
        // PATHS TO YOUR FILES:
        gameUrl: "games/quantam.html",   
        thumbnail: "thumbs/quantam.jpeg" 
    },
    
    // GAME 2: (Example - Copy this block to add a new game)
    {
        id: "game-002",
        title: "Coco Rampage",
        type: "game",
        publisher: "Admin",
        description: "A iland where you have to grow",
        gameUrl: "games/Coconut merge.html",
        thumbnail: "thumbs/coconut.jpg"
    },

        // GAME 3: (Example - Copy this block to add a new game)
    {
        id: "game-003",
        title: "Nuclear Reactor Simulation",
        type: "simulation",
        publisher: "Admin",
        description: "Educational Nuclear Reactor Simulation",
        gameUrl: "games/necularsimulation.html",
        thumbnail: "thumbs/nuclear.jpg"
    }
];