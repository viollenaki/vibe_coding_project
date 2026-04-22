import sys
import json
import subprocess

def main():
    try:
        input_data = json.load(sys.stdin)
        tool_name = input_data.get('tool_name')
        tool_input = input_data.get('tool_input', {})
        
        # We only care about file writing tools
        if tool_name in ['write_file', 'replace']:
            file_path = tool_input.get('file_path')
            if file_path and (file_path.endswith('.js') or file_path.endswith('.ts') or file_path.endswith('.json')):
                # In a real scenario, we would run:
                # subprocess.run(['npx', 'prettier', '--write', file_path], capture_output=True)
                print(f"DEBUG: Running Prettier on {file_path}", file=sys.stderr)
                
        # AfterTool must return a decision, usually "allow" to not interfere with the model's perception
        # or we can provide additionalContext.
        print(json.dumps({"decision": "allow", "additionalContext": "Applied code formatting with Prettier."}))
    except Exception as e:
        print(f"Error in prettier hook: {e}", file=sys.stderr)
        print(json.dumps({"decision": "allow"}))

if __name__ == "__main__":
    main()
