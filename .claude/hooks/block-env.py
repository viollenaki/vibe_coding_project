import sys
import json

def main():
    try:
        input_data = json.load(sys.stdin)
        tool_input = str(input_data.get('tool_input', ''))
        
        if '.env' in tool_input:
            print(json.dumps({
                "decision": "deny",
                "reason": "Security Policy: Access to .env files is blocked."
            }))
        else:
            print(json.dumps({"decision": "allow"}))
    except Exception as e:
        # On error, it's safer to allow or log to stderr
        print(f"Error in block-env hook: {e}", file=sys.stderr)
        print(json.dumps({"decision": "allow"}))

if __name__ == "__main__":
    main()
