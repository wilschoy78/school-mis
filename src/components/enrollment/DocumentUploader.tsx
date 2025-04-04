
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export const DocumentUploader = ({ open, setOpen, requirement, studentId }) => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', null
  const { toast } = useToast();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) return;
    
    // Check file type
    const fileExt = '.' + selectedFile.name.split('.').pop().toLowerCase();
    if (!requirement?.fileTypes.includes(fileExt)) {
      toast({
        title: "Invalid file type",
        description: `Please upload one of these formats: ${requirement?.fileTypes.join(', ')}`,
        variant: "destructive"
      });
      return;
    }
    
    // Check file size (in MB)
    const fileSizeMB = selectedFile.size / 1024 / 1024;
    if (fileSizeMB > requirement?.maxSize) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${requirement?.maxSize}MB`,
        variant: "destructive"
      });
      return;
    }
    
    setFile(selectedFile);
    setUploadStatus(null);
  };
  
  const handleUpload = () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate upload with progress
    setUploading(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setUploading(false);
          setUploadStatus('success');
          
          toast({
            title: "Upload successful",
            description: `${requirement.name} has been uploaded successfully.`
          });
          
          return 100;
        }
        return prevProgress + 10;
      });
    }, 300);
  };
  
  const reset = () => {
    setFile(null);
    setProgress(0);
    setUploadStatus(null);
    setUploading(false);
  };
  
  const handleClose = () => {
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload {requirement?.name}</DialogTitle>
          <DialogDescription>
            {requirement?.description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          {!file && !uploadStatus && (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12 cursor-pointer hover:bg-gray-50"
                 onClick={() => document.getElementById('file-upload').click()}
            >
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {requirement?.fileTypes.join(', ')} (Max: {requirement?.maxSize}MB)
              </p>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept={requirement?.fileTypes.join(',')}
              />
            </div>
          )}
          
          {file && !uploadStatus && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={reset}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {uploading && (
                <div className="space-y-2">
                  <Progress value={progress} />
                  <p className="text-sm text-center text-gray-500">Uploading... {progress}%</p>
                </div>
              )}
            </div>
          )}
          
          {uploadStatus === 'success' && (
            <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-green-50">
              <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
              <h3 className="text-lg font-medium text-green-800">Upload Successful</h3>
              <p className="text-sm text-green-600 text-center mt-1">
                {file.name} has been successfully uploaded for {requirement?.name}
              </p>
            </div>
          )}
          
          {uploadStatus === 'error' && (
            <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-red-50">
              <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
              <h3 className="text-lg font-medium text-red-800">Upload Failed</h3>
              <p className="text-sm text-red-600 text-center mt-1">
                There was an error uploading your file. Please try again.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={handleClose}>
            {uploadStatus === 'success' ? 'Close' : 'Cancel'}
          </Button>
          
          {!uploadStatus && (
            <Button 
              onClick={handleUpload} 
              disabled={!file || uploading}
            >
              {uploading ? 'Uploading...' : 'Upload File'}
            </Button>
          )}
          
          {uploadStatus === 'error' && (
            <Button onClick={reset}>Try Again</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
