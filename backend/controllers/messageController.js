const Message = require("../models/messageModel");

const getMessagesByRoom = async (req, res) => {
  try {
    const messages = await Message.find({ roomCode: req.params.room });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

const createMessage = async (req, res) => {
  try {
    const { roomCode, sender, text } = req.body; 
    const newMsg = new Message({ roomCode, sender, text });
    await newMsg.save();
    res.status(201).json(newMsg);
  } catch (error) {
    console.error("Erreur lors de l'envoi du message :", error);
    res.status(500).json({ error: "Erreur lors de l'envoi du message" });
  }
};

module.exports = { getMessagesByRoom, createMessage };
