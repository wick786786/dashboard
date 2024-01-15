import React, { useState } from 'react';
import ProgramForm from './ProgramForm';
import api from './api'; // Import the api.js file

const ProgramDetails = ({ program, onEdit, onSave, onDelete, setPrograms ,isAddingNew,onAddProgram,setEditProgram}) => {
    const [isEditMode, setEditMode] = useState(isAddingNew);
    const [formData, setFormData] = useState(program);
    const handleToggleEdit = () => {
        setEditMode(!isEditMode);
    };

    const updateProgram = async (updatedData) => {
        try {
            await api.updateProgram(program.id, updatedData);
    
            // Fetch the updated program data
            const updatedProgram = await api.getProgram(program.id);
    
            // Handle the updated data as needed
            console.log('Program updated:', updatedProgram);
            setEditMode(false); 
            if(setPrograms){
            setPrograms((prevPrograms) => {
                const updatedPrograms = prevPrograms.map((p) =>
                    p.id === program.id ? updatedProgram : p
                );
                return updatedPrograms;
            });
    
        }
        setEditMode(false);
        setFormData({});
        } catch (error) {
            console.error('Error updating program:', error);
            // Handle error if needed
        }
    };
    

    const handleSave = (updatedData) => {
        onSave(updatedData);
        setEditMode(false);
        setFormData({}); // Clear the form data

    };
    const handleDelete = async () => {
        try {
            await api.deleteProgram(program.id);

            // Update the programs state by removing the deleted program
            setPrograms((prevPrograms) => prevPrograms.filter((p) => p.id !== program.id));

            // Clear the selected program
            onEdit(null);
        } catch (error) {
            console.error('Error deleting program:', error);
            // Handle error if needed
        }
    };
    const handleAddProgram = () => {
        onAddProgram();
        setEditProgram(true); // Turn on edit mode when the plus button is clicked
        setEditMode(true);

    };
    return (
        <div className="program-details">
             
            {program ? (
                <>
               
                    {isEditMode ? (
                        <h2>Edit Program</h2>
                    ) : (
                        <h2>{program.name}</h2>
                    )}

                    <ProgramForm
                        program={{ ...program, isEditMode }}
                        onSave={updateProgram}
                        onCancel={handleToggleEdit}
                    />

                   
                </>
            ) : (
                <>
                    <h2>Add New Program</h2>
                    <button className="add-program-btn" onClick={handleAddProgram}>Add</button>
                    <ProgramForm
                        program={{ isEditMode }}
                        onSave={handleSave}
                        onCancel={handleToggleEdit}
                        readOnly={setEditProgram}
                    />
                </>
            )}
        </div>
    );
};

export default ProgramDetails;
