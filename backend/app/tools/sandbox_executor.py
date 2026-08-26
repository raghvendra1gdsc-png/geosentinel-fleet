import subprocess
import tempfile
import os
import sys

def execute_simulation_sandbox(script_code: str, timeout_seconds: int = 15) -> dict:
    """Executes structural code in an isolated subprocess and returns numerical outputs."""
    with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False) as temp_file:
        temp_file.write(script_code)
        temp_path = temp_file.name

    # Use the same python executable that is running the backend (venv python)
    python_exe = sys.executable

    try:
        # Run with isolated env
        env = os.environ.copy()
        run_process = subprocess.run(
            [python_exe, temp_path],
            capture_output=True,
            text=True,
            timeout=timeout_seconds,
            env=env,
            cwd=tempfile.gettempdir()
        )
        if run_process.returncode != 0:
            return {
                "success": False,
                "error": run_process.stderr.strip()
            }
        return {
            "success": True,
            "stdout": run_process.stdout.strip()
        }
    except subprocess.TimeoutExpired:
        return {"success": False, "error": f"Execution timed out ({timeout_seconds}s limit)."}
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)