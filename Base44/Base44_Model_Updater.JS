function updateBelief(belief, observation, difficulty, slip, guess, model) {

  const newBelief = [];

  for (let i = 0; i < model.states.length; i++) {

    const mastery = model.base_mastery[model.states[i]];
    let pCorrect = mastery*(1-slip) + (1-mastery)*guess;

    pCorrect *= model.difficulty_multiplier[difficulty];

    const emission = observation === "correct" ? pCorrect : (1 - pCorrect);

    let sum = 0;
    for (let j = 0; j < model.states.length; j++) {
      sum += belief[j] * model.transition_matrix[j][i];
    }

    newBelief[i] = emission * sum;
  }

  const norm = newBelief.reduce((a,b)=>a+b,0);
  return newBelief.map(x => x / norm);
}
