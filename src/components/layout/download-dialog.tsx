import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DownloadIcon } from "lucide-react";
import { ReactNode, useState } from "react";

interface DownloadDialogProps {
  selectedItems: string[];
  trigger?: ReactNode;
}

export function DownloadDialog({
  selectedItems,
  trigger,
}: DownloadDialogProps) {
  const [filePath, setFilePath] = useState("");
  const [estimatedSize, setEstimatedSize] = useState("Calculating");

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="w-[400px]">
        <DialogHeader>
          <DialogTitle>Download Files</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid gap-2">
            <label className="font-medium text-black dark:text-white">
              Selected Items
            </label>
            <div className="bg-white dark:bg-gray-800 p-2 rounded-md text-sm border border-gray-300 dark:border-gray-700 text-black dark:text-white">
              {selectedItems.length}
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid gap-2">
              <label className="font-medium text-black dark:text-white">
                Estimated Size of Download
              </label>
              <p className="bg-white dark:bg-gray-800 p-2 rounded-md text-sm border border-gray-300 dark:border-gray-700 text-black dark:text-white">
                {estimatedSize}
              </p>
            </div>
          </div>
          <div className="grid gap-2">
            <label className="font-medium text-black dark:text-white">
              Browse Path
            </label>
            <Input
              value={filePath}
              onChange={(e) => setFilePath(e.target.value)}
              placeholder="Enter the file path"
            />
            <p className="text-sm text-muted-foreground">
              Example: <code>D:\cts132\W03\L03\FilePaths</code>
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button
              onClick={() => {
                alert(`Download initiated for: ${selectedItems.join(", ")}`);
              }}
            >
              <DownloadIcon className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
