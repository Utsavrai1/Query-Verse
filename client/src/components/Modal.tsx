import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle className="text-lg font-bold dark:text-white">
          {title}
        </DialogTitle>
        <DialogDescription className="space-y-4">{children}</DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
