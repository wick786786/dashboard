import React, { useState, useEffect } from 'react';
import ProgramList from './ProgramList';
import ProgramDetails from './ProgramDetails';
import './App.css';

const App = () => {
    const [programs, setPrograms] = useState([]);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [isAddingProgram, setAddingProgram] = useState(false);
    const [editProgram, setEditProgram] = useState(false);

    useEffect(() => {
        // Fetch programs from the API
        fetch('http://localhost:5000/programs')
            .then((response) => response.json())
            .then((data) => setPrograms(data))
            .catch((error) => console.error('Error fetching programs:', error));
    }, []);

    const handleProgramClick = (program) => {
        // Set the selected program when a program is clicked
        setSelectedProgram(program);
        setAddingProgram(false); // Close the add program form
        setEditProgram(false);
    };
    const handleDeleteProgram = async (programId) => {
        try {
            // Call the API to delete the program
            await fetch(`http://localhost:5000/programs/${programId}`, {
                method: 'DELETE',
            });

            // Update the programs state by filtering out the deleted program
            setPrograms((prevPrograms) => prevPrograms.filter((program) => program.id !== programId));
            setSelectedProgram(null); // Clear the selected program

            console.log(`Program with ID ${programId} deleted successfully.`);
            
        } catch (error) {
            console.error('Error deleting program:', error);
            // Handle error if needed
        }
    };

    const handleAddProgram = () => {
        setSelectedProgram(null); // Clear selected program
        setEditProgram(true);
        setAddingProgram(true); // Open the add program form
    };

    const handleSaveProgram = (newProgram) => {
        // Save the new program to the database
        // You can use the fetch API or a library like Axios for making the API request
        fetch('http://localhost:5000/programs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProgram),
        })
            .then((response) => response.json())
            .then((data) => {
                // Update the programs state with the new program
                setPrograms([...programs, data]);
                setAddingProgram(false); // Close the add program form
            })
            .catch((error) => console.error('Error adding program:', error));
    };

    return (
        <div className="app-container">
            <ProgramList
                programs={programs}
                onProgramClick={handleProgramClick}
                onDelete={handleDeleteProgram}
                onAddProgram={handleAddProgram}
                setEditProgram={setEditProgram}
            />
            {isAddingProgram ? (
                <ProgramDetails
                    program={null}
                    onEdit={() => {}}
                    onSave={handleSaveProgram}
                    onDelete={() => {}}
                    setEditProgram={setEditProgram}
                    
                />
            ) : (
                <ProgramDetails
                    program={selectedProgram}
                    onEdit={() => {}}
                    onSave={() => {}}
                    onDelete={() => {}}
                    onAddProgram={handleAddProgram}
                    setEditProgram={setEditProgram}
                />
            )}
        </div>
    );
};

export default App;
