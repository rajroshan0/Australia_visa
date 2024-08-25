
require ('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const app = express();


const { PDFDocument, rgb } = require('pdf-lib'); // Import PDF-lib
const { configDotenv } = require('dotenv');
 

// Serve the output directory for static files
app.use('/output', express.static(path.join(__dirname, 'output')));



// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Connect to MongoDB
// mongoose.connect('mongodb+srv://rkp78925:BmO5D5gfms1akOi9@cluster0.l0ei90l.mongodb.net/visaDatabase')

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Error connecting to MongoDB Atlas:', err));

// Defi
// Define a schema and model
const visaSchema = new mongoose.Schema({
    documentType: String,
    documentNumber: String,  // Passport number
    grantNumber: Number,
    referenceType: String,
    dob: Date,
    nationality: String,
    country: String,
});

const Visa = mongoose.model('Visa', visaSchema);

// Serve the form page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// // Function to generate a random 6-digit number
// function generateRandomNumber() {
//     return Math.floor(100000 + Math.random() * 900000);

// }

// Handle form submission
app.post('/submit', async (req, res) => {
    const { documentType, documentNumber, grantNumber, referenceType, dob, nationality, country } = req.body;
    

//      // Generate current date for dateOfGrant
//         const dateOfGrant = new Date();
//    // Generate random 6-digit numbers for applicationID and transactionReferenceNumber
//         const applicationID = generateRandomNumber();
//         const transactionReferenceNumber = generateRandomNumber();

        const newVisa = new Visa({
            documentType,
            documentNumber,  // Passport number
            grantNumber,
            referenceType,
            dob,
            nationality,
            country,
            // dateOfGrant, // Assign the current date
            // applicationID, // Assign the generated application ID
            // transactionReferenceNumber
    });

    try {
        await newVisa.save();
        res.send('Your form is submitted successfully!');
    } catch (err) {
        console.error('Error saving data:', err);
        res.status(500).send('Error saving data.');
    }
});

// Handle search and PDF generation by passport number
// app.get('/search', async (req, res) => {
//     const { documentNumber } = req.query;

//     console.log('Search query received:', documentNumber);  // Debugging log

//     try {
//         const visaHolder = await Visa.findOne({ documentNumber });
        
//         if (!visaHolder) {
//             return res.json({ error: 'No records found.' });
//         }

//         // Generate PDF
//         const pdfDirectory = path.join(__dirname, 'public/pdf');
//         if (!fs.existsSync(pdfDirectory)) {
//             fs.mkdirSync(pdfDirectory, { recursive: true });
//         }
//         const filePath = path.join(pdfDirectory, `${documentNumber}.pdf`);
//         const doc = new PDFDocument();
//         doc.pipe(fs.createWriteStream(filePath));
        
//         doc.fontSize(20).text('Visa Holder Information', { align: 'center' });
//         doc.moveDown();
//         doc.fontSize(14).text(`Document Type: ${visaHolder.documentType}`);
//         doc.text(`Document Number: ${visaHolder.documentNumber}`);
//         doc.text(`Grant Number: ${visaHolder.grantNumber}`);
//         doc.text(`Reference Type: ${visaHolder.referenceType}`);
//         doc.text(`Date of Birth: ${visaHolder.dob.toDateString()}`);
//         doc.text(`Nationality: ${visaHolder.nationality}`);
//         doc.text(`Country: ${visaHolder.country}`);
        
//         doc.end();

//         // Ensure the PDF is finished before attempting to download
//         doc.on('finish', () => {
//             res.download(filePath, (err) => {
//                 if (err) {
//                     console.error('Error during file download:', err);
//                     res.status(500).send('Error downloading file.');
//                 }
//             });
//         });

//     } catch (err) {
//         console.error('Error retrieving data:', err);
//         res.status(500).json({ error: 'Error retrieving data.' });
//     }
// });

// Start the server




// app.get('/search', async (req, res) => {
//     const { documentNumber } = req.query;

//     console.log('Search query received:', documentNumber);

//     try {
//         const visaHolder = await Visa.findOne({ 
//             $or: [
//                 { documentNumber: documentNumber }, 
//                 { documentNumber: Number(documentNumber) } 
//             ]
//         });

//         if (!visaHolder) {
//             return res.json({ error: 'No records found.' });
//         }
//         //return res.json(visaHolder);

//         // Log the entire document to see what's being retrieved
//         console.log('Visa holder found:', visaHolder);

//         const pdfDirectory = path.join(__dirname, 'public/pdf');
//         if (!fs.existsSync(pdfDirectory)) {
//             fs.mkdirSync(pdfDirectory, { recursive: true });
//         }
//         const filePath = path.join(pdfDirectory, `${documentNumber}.pdf`);
//         const doc = new PDFDocument();
//         doc.pipe(fs.createWriteStream(filePath));
        
//         doc.fontSize(20).text('Visa Holder Information', { align: 'center' });
//         doc.moveDown();
//         doc.fontSize(14).text(`Document Type: ${visaHolder.documentType || 'N/A'}`);
//         doc.text(`Document Number: ${visaHolder.documentNumber || 'N/A'}`);
//         doc.text(`Grant Number: ${visaHolder.grantNumber || 'N/A'}`);
//         doc.text(`Reference Type: ${visaHolder.referenceType || 'N/A'}`);
//         doc.text(`Date of Birth: ${visaHolder.dob ? visaHolder.dob.toDateString() : 'N/A'}`);
//         doc.text(`Nationality: ${visaHolder.nationality || 'N/A'}`);
//         doc.text(`Country: ${visaHolder.country || 'N/A'}`);
        
//         doc.end();

//         doc.on('finish', () => {
//             res.download(filePath, (err) => {
//                 if (err) {
//                     console.error('Error during file download:', err);
//                     res.status(500).send('Error downloading file.');
//                 }
//             });
//         });
//         return res.json(visaHolder);

//     } catch (err) {
//         console.error('Error retrieving data:', err);
//         res.status(500).json({ error: 'Error retrieving data.' });
//     }
// });




// WORKING FINE FOR SEARCH PART

// app.get('/search', async (req, res) => {
//     const { documentNumber } = req.query;

//     console.log('Search query received:', documentNumber);

//     try {
//         const visaHolder = await Visa.findOne({ 
//             $or: [
//                 { documentNumber: documentNumber }, 
//                 { documentNumber: Number(documentNumber) } 
//             ]
//         });

//         // Handle case where no visa holder is found
//         if (!visaHolder) {
//             console.log('No records found for document number:', documentNumber);
//             return res.json({ error: 'No records found.' }); // Return error message
//         }

//         // Log the found visa holder details for debugging
//         console.log('Visa holder found:', visaHolder);

//         // Generate PDF only if the visa holder is found
// //         const pdfDirectory = path.join(__dirname, 'public/pdf');
// //         if (!fs.existsSync(pdfDirectory)) {
// //             fs.mkdirSync(pdfDirectory, { recursive: true });
// //         }

// //         const filePath = path.join(pdfDirectory, `${documentNumber}.pdf`);
// //         const doc = new PDFDocument();
// //         doc.pipe(fs.createWriteStream(filePath));
        
// //         doc.fontSize(20).text('Visa Holder Information', { align: 'center' });
// //         doc.moveDown();
// //         doc.fontSize(14).text(`Document Type: ${visaHolder.documentType || 'N/A'}`);
// //         doc.text(`Document Number: ${visaHolder.documentNumber || 'N/A'}`);
// //         doc.text(`Grant Number: ${visaHolder.grantNumber || 'N/A'}`);
// //         doc.text(`Reference Type: ${visaHolder.referenceType || 'N/A'}`);
// //         doc.text(`Date of Birth: ${visaHolder.dob ? visaHolder.dob.toDateString() : 'N/A'}`);
// //         doc.text(`Nationality: ${visaHolder.nationality || 'N/A'}`);
// //         doc.text(`Country: ${visaHolder.country || 'N/A'}`);
        
// //         doc.end();

// //         // Wait for the PDF to be fully generated before sending the download response
// //         doc.on('finish', () => {
// //             res.download(filePath, (err) => {
// //                 if (err) {
// //                     console.error('Error during file download:', err);
// //                     return res.status(500).send('Error downloading file.');
// //                 }
// //             });
// //         });

// //         // Additionally, send the visaHolder data as a response (helpful for debugging or frontend display)
// //         return res.json(visaHolder);

// //     } catch (err) {
// //         console.error('Error retrieving data:', err);
// //         return res.status(500).json({ error: 'Error retrieving data.' });
// //     }
// // });


// // Generate PDF only if the visa holder is found
// const pdfDirectory = path.join(__dirname, 'public/pdf');
// if (!fs.existsSync(pdfDirectory)) {
//     fs.mkdirSync(pdfDirectory, { recursive: true });
// }

// const filePath = path.join(pdfDirectory, `${documentNumber}.pdf`);
// const doc = new PDFDocument();
// doc.pipe(fs.createWriteStream(filePath));

// // Title
// doc.fontSize(20).text('Visa Holder Information', { align: 'center' });
// doc.moveDown();

// // Visa Holder Information
// doc.fontSize(14).text(`Document Type: ${visaHolder.documentType || 'N/A'}`);
// doc.text(`Document Number: ${visaHolder.documentNumber || 'N/A'}`);
// doc.text(`Grant Number: ${visaHolder.grantNumber || 'N/A'}`);
// doc.text(`Reference Type: ${visaHolder.referenceType || 'N/A'}`);
// doc.text(`Date of Birth: ${visaHolder.dob ? visaHolder.dob.toDateString() : 'N/A'}`);
// doc.text(`Nationality: ${visaHolder.nationality || 'N/A'}`);
// doc.text(`Country: ${visaHolder.country || 'N/A'}`);
// doc.moveDown();

// // Visa summary details
// doc.text(`Name: ${visaHolder.name || 'N/A'}`);
// doc.text(`Sponsor Name: ${visaHolder.sponsorName || 'N/A'}`);
// doc.text(`Sponsor Date of Birth: ${visaHolder.sponsorDob || 'N/A'}`);
// doc.text(`Visa Grant Number: ${visaHolder.grantNumber || 'N/A'}`);
// doc.text(`Passport Number: ${visaHolder.passportNumber || 'N/A'}`);
// doc.text(`Passport Country: ${visaHolder.passportCountry || 'N/A'}`);
// doc.text(`Visa Stream: ${visaHolder.visaStream || 'N/A'}`);
// doc.text(`Date of Grant: ${visaHolder.grantDate || 'N/A'}`);
// doc.text(`Must Not Arrive After: ${visaHolder.mustNotArriveAfter || 'N/A'}`);
// doc.text(`Length of Stay: ${visaHolder.lengthOfStay || 'N/A'}`);
// doc.text(`Travel: ${visaHolder.travel || 'N/A'}`);
// doc.text(`Application ID: ${visaHolder.applicationId || 'N/A'}`);
// doc.text(`Sponsor ID Number: ${visaHolder.sponsorIdNumber || 'N/A'}`);
// doc.moveDown();

// // Visa conditions
// doc.fontSize(14).text('Visa Conditions');
// doc.text(`8101 - No work`);
// doc.text(`8201 - Maximum three months study`);
// doc.moveDown();

// // Application status
// doc.text(`Application Status: ${visaHolder.applicationStatus || 'Visitor (subclass 600):'}`);
// doc.moveDown();

// // Visa duration and travel
// doc.fontSize(14).text('Visa Duration and Travel');
// doc.text(`Duration: ${visaHolder.visaDuration || '12 month(s) from the date of each arrival'}`);
// doc.text(`Entries: ${visaHolder.entries || 'Multiple entries'}`);
// doc.moveDown();

// // Important information
// doc.fontSize(14).text('Important Information');
// doc.text(`Character requirements: ${visaHolder.characterRequirements || 'Entering or remaining in Australia is a privilege. You must obey the law and not engage in criminal activity.'}`);
// doc.text(`Update us: ${visaHolder.updateUs || 'You are required to tell us about any changes to your details as soon as possible.'}`);
// doc.moveDown();

// // Useful links
// doc.fontSize(14).text('Useful Links');
// doc.text('Check your visa details in VEVO: www.homeaffairs.gov.au/vevo');
// doc.text('Update your details in ImmiAccount: www.homeaffairs.gov.au/immiaccount');
// doc.text('Learn about family safety: www.dss.gov.au/family-safety-pack');
// doc.text('Update your details (including passport or if you have a baby): immi.homeaffairs.gov.au/change-in-situation');
// doc.text('More information: www.homeaffairs.gov.au');
// doc.moveDown();

// // Footer
// doc.text('Yours sincerely', { align: 'left' });
// doc.text('Department of Home Affairs', { align: 'left' });
// doc.text(`Position number: ${visaHolder.positionNumber || 'N/A'}`, { align: 'left' });
// doc.text(`Sent to: ${visaHolder.sentTo || 'N/A'}`, { align: 'left' });
// doc.text(`Sent on: ${visaHolder.sentOn || 'N/A'}`, { align: 'left' });

// doc.end();

// // Wait for the PDF to be fully generated before sending the download response
// doc.on('finish', () => {
//     res.download(filePath, (err) => {
//         if (err) {
//             console.error('Error during file download:', err);
//             return res.status(500).send('Error downloading file.');
//         }
//     });
// });

// // Additionally, send the visaHolder data as a response (helpful for debugging or frontend display)
// return res.json(visaHolder);
// } catch (err) {
// console.error('Error retrieving data:', err);
// return res.status(500).json({ error: 'Error retrieving data.' });
// }

// });






app.get('/search', async (req, res) => {
    const { documentNumber } = req.query;

    console.log('Search query received:', documentNumber);

    try {
        const visaHolder = await Visa.findOne({
            $or: [
                { documentNumber: documentNumber },
                { documentNumber: Number(documentNumber) }
            ]
        });

        if (!visaHolder) {
            console.log('No records found for document number:', documentNumber);
            return res.json({ error: 'No records found.' });
        }

        console.log('Visa holder found:', visaHolder);

        // Load the existing PDF template
        // const templatePath = path.join(__dirname, 'templates', 'certificate-template.pdf');
        const templatePath = path.join(__dirname, 'public', 'templates', 'certificate-template.pdf');
        
        const pdfDoc = await PDFDocument.load(fs.readFileSync(templatePath));
        const page = pdfDoc.getPages()[0];

        // Define font size and color
        const fontSize = 12;
        const color = rgb(0, 0, 0);

        // Safely extract and format the data
        const documentTypeText = visaHolder.documentType || 'N/A';
        const documentNumberText = visaHolder.documentNumber || 'N/A';
        const grantNumberText = visaHolder.grantNumber || 'N/A';
        const referenceTypeText = visaHolder.referenceType || 'N/A';
        const dobText = visaHolder.dob ? new Date(visaHolder.dob).toLocaleDateString() : 'N/A';
        const countryText = visaHolder.country || 'N/A';

        // const dateOfGrantText = visaHolder.dateOfGrant || 'N/A';
        // const applicationIDText = visaHolder.applicationID || 'N/A';
        // const transactionReferenceNumberText = visaHolder.transactionReferenceNumber || 'N/A';

        // Log the data for debugging
        console.log(`Document Type: ${documentTypeText}`);
        console.log(`Document Number: ${documentNumberText}`);
        console.log(`Grant Number: ${grantNumberText}`);
        console.log(`Reference Type: ${referenceTypeText}`);
        console.log(`Date of Birth: ${dobText}`);
        console.log(`Country: ${countryText}`);

        // console.log(`Country: ${dateOfGrant}`);
        // console.log(`Country: ${applicationID}`);
        // console.log(`Country: ${transactionReferenceNumber}`);


        // Draw text on the PDF at specific positions
        page.drawText(`  ${documentTypeText}`, { x: 255, y: 130, size: fontSize, color });
        page.drawText(` ${documentNumberText}`, { x: 225, y: 180, size: fontSize, color });
        page.drawText(`  ${grantNumberText}`, { x: 225, y: 208, size: fontSize, color });
        page.drawText(` ${referenceTypeText}`, { x: 285, y: 180, size: fontSize, color });
        page.drawText(` ${dobText}`, { x: 225, y: 296, size: fontSize, color });
        page.drawText(`${countryText}`, { x: 225, y: 130, size: fontSize, color });


        // page.drawText(`${dateOfGrant}`, { x: 225, y: 130, size: fontSize, color });
        // page.drawText(`${applicationID}`, { x: 225, y: 130, size: fontSize, color });
        // page.drawText(`${transactionReferenceNumber}`, { x: 225, y: 130, size: fontSize, color });

        // Serialize the PDFDocument to bytes
        const pdfBytes = await pdfDoc.save();

        // Define the output path
        const outputPath = path.join(__dirname, 'output', `${documentNumber}-certificate.pdf`);
        fs.writeFileSync(outputPath, pdfBytes);

        // Send back the URL to the generated PDF
        res.json({ success: true, url: `/output/${documentNumber}-certificate.pdf` });

    } catch (error) {
        console.error('Error Visa not found:', error.message);
        return res.status(500).json({ error: 'Error retrieving data or  Visa not found.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});