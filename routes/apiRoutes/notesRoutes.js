const router = require("express").Router();
const { findById, createNewNote, validateNote, } = require("../../lib/notes");
const { notes } = require("../../db/db.json");
const fs = require('fs');

router.get('/notes', (req, res) => {
    let results = notes;
    res.json(results);
});

router.get('/notes/:id', (req, res) => {
  const result = findById(req.params.id, notes);
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
});

router.post('/notes', (req, res) => {
  // set id based on what the next index of the array will be
  req.body.id = notes.length.toString();

  if (!validateNote(req.body)) {
    res.status(400).send('The note is not properly formatted.');
  } else {
    const note = createNewNote(req.body, notes);
    res.json(note);
  }
});

router.delete('/notes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = notes.findIndex(notes => parseInt(notes.id) === id);

  if (index === -1) {
    // Note not found
    console.log(`Note with ID ${id} not found`);
    return res.status(404).send('Note not found');
  }

  // remove note from array
  notes.splice(index, 1);
  console.log(`Deleted note with ID ${id}`);

  // Write the updated data array back to the file
  let data = '{"notes":' + JSON.stringify(notes) + "}";
  fs.writeFileSync("db/db.json", data);

  // Return a success message
  res.send(`Note ${id} deleted successfully`);
});

module.exports = router;