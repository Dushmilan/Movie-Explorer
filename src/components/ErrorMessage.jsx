import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

// Shared error banner. The retry button is optional.
export default function ErrorMessage({ message, onRetry }) {
  return (
    <Alert
      severity="error"
      action={
        onRetry ? (
          <Button color="inherit" size="small" onClick={onRetry}>
            Retry
          </Button>
        ) : null
      }
    >
      {message}
    </Alert>
  );
}
