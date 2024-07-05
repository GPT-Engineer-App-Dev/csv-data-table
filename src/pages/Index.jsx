import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import Papa from "papaparse";

const Index = () => {
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setHeaders(Object.keys(results.data[0]));
          setCsvData(results.data);
          setFileName(file.name);
        },
      });
    } else {
      toast.error("Please upload a valid .csv file.");
    }
  };

  const handleCellChange = (rowIndex, columnKey, value) => {
    const updatedData = [...csvData];
    updatedData[rowIndex][columnKey] = value;
    setCsvData(updatedData);
  };

  const handleAddRow = () => {
    const newRow = headers.reduce((acc, header) => {
      acc[header] = "";
      return acc;
    }, {});
    setCsvData([...csvData, newRow]);
  };

  const handleRemoveRow = (rowIndex) => {
    const updatedData = csvData.filter((_, index) => index !== rowIndex);
    setCsvData(updatedData);
  };

  const handleDownload = () => {
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", fileName || "edited.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV file downloaded successfully.");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <input type="file" accept=".csv" onChange={handleFileUpload} />
      </div>
      {csvData.length > 0 && (
        <>
          <div className="mb-4 flex space-x-2">
            <Button onClick={handleAddRow}>Add Row</Button>
            <Button onClick={handleDownload}>Download CSV</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header) => (
                  <TableHead key={header}>{header}</TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {csvData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {headers.map((header) => (
                    <TableCell key={header}>
                      <input
                        type="text"
                        value={row[header]}
                        onChange={(e) => handleCellChange(rowIndex, header, e.target.value)}
                        className="w-full border border-gray-300 p-1"
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button variant="destructive" onClick={() => handleRemoveRow(rowIndex)}>
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
};

export default Index;