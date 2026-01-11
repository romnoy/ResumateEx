let model;
let trainingData = [];
let state = 'loading'; // Track the state: loading, ready, training, trained

document.addEventListener('DOMContentLoaded', function () {
    console.log('Page loaded, initializing ML5...');

    // Initialize neural network
    let options = {
        inputs: ['question1', 'question2', 'question3', 'question4'],
        outputs: ['personalityType'],
        task: 'classification',
        debug: true
    };
    model = ml5.neuralNetwork(options);

    // Load JSON data
    fetch('JSON/personalities_data_updated.json')
        .then(response => response.json())
        .then(data => {
            console.log('Data loaded:', data.length, 'records');
            loadDataIntoModel(data);
        })
        .catch(error => {
            console.error('Error loading data:', error);
        });
});

function loadDataIntoModel(data) {
    for (let i = 0; i < data.length; i++) {
        let record = data[i];

        let inputs = {
            question1: record.question1,
            question2: record.question2,
            question3: record.question3,
            question4: record.question4
        };

        let target = {
            personalityType: record.personalityType
        };

        model.addData(inputs, target);
    }

    console.log('All data added to model!');
    state = 'ready';
    console.log('Press "t" to start training');
}

// Add keyboard event listener for 't' and 's' keys
document.addEventListener('keypress', function (event) {
    if (event.key === 't' && state === 'ready') {
        trainModel();
    } else if (event.key === 's' && state === 'trained') {
        saveModel();
    }
});

function trainModel() {
    state = 'training';
    console.log('Starting training...');

    // Normalize data
    model.normalizeData();

    // Training options
    let trainingOptions = {
        epochs: 100,
        batchSize: 12
    };

    // Train the model
    model.train(trainingOptions, whileTraining, finishedTraining);
}

function whileTraining(epoch, loss) {
    console.log(`Epoch: ${epoch}, Loss: ${loss.toFixed(4)}`); // FIXED: Changed backtick to parenthesis
}

function finishedTraining() {
    console.log('Training complete!');
    state = 'trained';
    console.log('Model is ready for predictions!');
    console.log('Press "s" to save the model');
}

function saveModel() {
    console.log('Saving model...');
    model.save();
    console.log('Model saved successfully! Check your downloads folder.');
}