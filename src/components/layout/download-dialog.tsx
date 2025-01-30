import { useState } from "react";
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

export function DownloadDialog({ trigger }: { trigger?: React.ReactNode }) {
  const [filePath, setFilePath] = useState("");
  const [estimatedSize, setEstimatedSize] = useState("Calculating...");

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button variant="ghost">Download</Button>}
      </DialogTrigger>
      <DialogContent className="w-[400px]">
        <DialogHeader>
          <DialogTitle>Download Files</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-2">
            <label className="font-medium">Estimated Size of Download</label>
            <p className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md text-sm">
              {estimatedSize}
            </p>
          </div>
          <div className="grid gap-2">
            <label className="font-medium">Browse Path</label>
            <Input
              value={filePath}
              onChange={(e) => setFilePath(e.target.value)}
              placeholder="Enter the file path"
            />
            {/* Help text */}
            <p className="text-sm text-muted-foreground">
              Example: <code>D:\cts132\W03\L03\FilePaths</code>
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button onClick={() => alert("Download initiated")}>
              <DownloadIcon className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
