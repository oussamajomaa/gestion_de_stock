import domtoimage from 'dom-to-image';
import jsPDF from "jspdf";
export const exportToPDF = (table:any, name:string) => {
    domtoimage.toPng(table).then((dataUrl: any) => {
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 190;
        const pageHeight = 297;
        const imgHeight = (table.offsetHeight * imgWidth) / table.offsetWidth;

        pdf.addImage(dataUrl, "PNG", 10, 10, imgWidth, imgHeight);
        pdf.save(name+".pdf");
    }).catch((error:any) => {
        console.error("Erreur lors de l'exportation : ", error);
    });
};