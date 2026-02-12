import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export function showSuccess(message: string) {
  Toast.fire({ icon: "success", title: message });
}

export function showError(message: string) {
  Toast.fire({ icon: "error", title: message });
}

export function showInfo(message: string) {
  Toast.fire({ icon: "info", title: message });
}

export async function confirmDelete(
  title = "Delete this link?",
  text = "This will permanently delete this link and all its analytics data."
): Promise<boolean> {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#EF4444",
    cancelButtonColor: "#64748B",
    confirmButtonText: "Yes, delete it",
    cancelButtonText: "Cancel",
  });

  return result.isConfirmed;
}
