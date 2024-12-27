import PatientReport from '../schema/patientreport.js';

// Generate a financial report
export const generateReport = async (req, res) => {
    try {
        const { patientId , doctorId, consultationDate, symptoms, diagnosis, treatmentPlan, followUpDate } = req.body;

        if (!patientId || !doctorId || !consultationDate || !symptoms || !diagnosis || !treatmentPlan) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const report = new PatientReport({ patientId, doctorId, consultationDate, symptoms, diagnosis, treatmentPlan, followUpDate });
        await report.save();

        res.status(201).json(report);
    } catch (error) {
        res.status(500).json({ message: 'Error generating report', error });
    }
};
