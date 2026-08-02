#!/usr/bin/env sh
# Stops the sail containers once dev is over.

dev_pid=$1

cd "$(dirname "$0")/.."

exec >/dev/null 2>&1

anchor=$dev_pid
pid=$dev_pid
while [ -n "$pid" ] && [ "$pid" -gt 1 ] 2>/dev/null; do
    case "$(ps -o args= -p "$pid" 2>/dev/null)" in
        *turbo*)
            anchor=$pid
            break
            ;;
    esac
    pid=$(ps -o ppid= -p "$pid" 2>/dev/null | tr -d ' ')
done

while kill -0 "$dev_pid" 2>/dev/null && kill -0 "$anchor" 2>/dev/null; do
    sleep 1
done

kill -TERM "$dev_pid" 2>/dev/null
vendor/bin/sail stop
