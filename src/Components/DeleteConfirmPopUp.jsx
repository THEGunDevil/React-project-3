import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";

export function DeleteConfirmPopUp({
  deletePopUp,
  cancelDelete,
  confirmDelete,
  inputValue,
  setInputValue,
  errorMessage,
}) {
  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <section className="absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex w-screen h-screen justify-center items-center">
      <Dialog open={deletePopUp} onOpenChange={cancelDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are You Sure You Want to Delete This?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This data will be permanently removed
              from the database.
            </DialogDescription>
            <p className="text-shadow-destructive">
              ⚠️ To proceed with deletion, please write <b>Confirm Delete</b>{" "}
              below.
            </p>
            <Input
              type="text"
              value={inputValue}
              onChange={handleChange}
              placeholder="Type 'Confirm Delete' to proceed"
              aria-label="Confirm deletion input"
            />
            {errorMessage && (
              <p className="text-destructive">{errorMessage}</p>
            )}
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDelete}
              className="cursor-pointer"
              aria-label="Cancel deletion"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete} // Call the pre-bound confirmDelete
              className="cursor-pointer hover:bg-red-700"
              aria-label="Confirm deletion"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}