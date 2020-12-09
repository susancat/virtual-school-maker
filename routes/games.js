// Functionality to interact with the "games" collection
// Each game has a unique PIN
// Similar to Kahoot

const express = require("express");
const router = express.Router();
const Game = require("../models/game")
const Quiz = require("../models/quiz")

// POST: Create a new game with a randomly generated PIN.
// Return that PIN in the response
// JSON Structure: {name: <string>, quizId: <string>}
router.post('/', async (req, res) => {
    // Generate a PIN and
    const pin = generatePin()

    // Ensure the pin doesn't already exist
    while (true) {
        const collision = await Game.findOne({pin: req.params.pin}).exec();
        
        // If no collision, break out.
        if (!collision) {
            break;
        }
        // Generate a new one
        pin = generatePin()
    }

    // TODO: Make QuizId into quiz name or something
    // QuizId is currently the database ID. Not user friendly
    const game = new Game({
        pin, name: req.body.name, quizId: req.body.quizId
    })

    try {
        const newGame = await game.save()
        res.status(201).json(newGame)
    }
    catch (err) {
        res.status(400).json({message: err.message})
    }
})

// GET: Returns a game's questions with a given ID
router.get('/:pin', async (req, res) => {
    // Get the game document in database
    const game = await Game.findOne({pin: req.params.pin}).exec()

    // If no game was found, then return "game not found" to user
    if (!game) {
        res.status(404).json({message: "Game not found"})
    }

    // Find quiz associated with the game and return it
    console.log(game.quizId)
    const quiz = await Quiz.findById(game.quizId).populate('questions').exec()
    console.log(quiz)
    res.json(quiz)
})

// DELETE: Clear a game when it's done
// Ideally will be called by Roblox
// Probably can make this more secure. It's currently using the pin for simplicity
router.delete('/:pin', async (req, res) => {
    // Get the game document in database
    const game = await Game.findOne({pin: req.params.pin}).exec()

    try {
        game.remove()
        res.json({message: "Game removed from database"})
    }
    catch (err) {
        res.json({message: err.message})
    }
})

// Generates a PIN. Returns a string. 4 digits
const generatePin = () => {
    let pin = ""
    for (i = 0; i < 4; i++) {
        pin += Math.floor(Math.random() * 10).toString()
    }
    return pin
}


module.exports = router