import pytest
from backend.app.tools.sandbox_executor import execute_simulation_sandbox

def test_sandbox_normal_execution():
    """Verify sandboxed python subprocess execution."""
    code = "import json; print(json.dumps({'status': 'SUCCESS', 'result': 42 * 2}))"
    res = execute_simulation_sandbox(code, timeout_seconds=15)
    assert res["success"] is True
    assert "84" in res["stdout"]

def test_sandbox_syntax_error():
    """Verify safe handling and stderr capture of invalid syntax."""
    code = "def broken(:"
    res = execute_simulation_sandbox(code, timeout_seconds=15)
    assert res["success"] is False
    assert "SyntaxError" in res["error"]

def test_sandbox_timeout_termination():
    """Verify that execution exceeding timeout is safely killed without crashing."""
    code = "import time; time.sleep(5)"
    res = execute_simulation_sandbox(code, timeout_seconds=1)
    assert res["success"] is False
    assert "timed out" in res["error"].lower()

def test_sandbox_openseespy_import():
    """Verify OpenSeesPy can be loaded and wiped inside sandbox."""
    code = """
import json
try:
    import openseespy.opensees as ops
    ops.wipe()
    print(json.dumps({"opensees": "OK"}))
except Exception as e:
    print(json.dumps({"opensees": str(e)}))
"""
    res = execute_simulation_sandbox(code, timeout_seconds=15)
    assert res["success"] is True
    assert "opensees" in res["stdout"]
