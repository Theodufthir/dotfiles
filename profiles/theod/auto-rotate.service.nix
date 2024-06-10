pkgs: monitor: {
  Unit = {
    Description = "Auto-rotate screen service";
    After = [ "hyprland-session.target" "iio-sensor-proxy.service" ];
  };
  
  Install = {
    WantedBy = [ "hyprland-session.target" ];
  };
  
  Service = {
    Type = "exec";
    Restart= "on-failure";
    ExecStart = pkgs.writeShellScript "auto-rotate.service.sh" (''

declare -A matching
matching=([normal]=0 [left-up]=1 [bottom-up]=2 [right-up]=3)
orientation="none"
monitor="${monitor}"

echo 'Hyprand signature is: ' $HYPRLAND_INSTANCE_SIGNATURE

while read line; do
  lastOrientation=$orientation

  orientation=$(echo "$line" | sed -rn 's/.*orientation( changed)?: ([a-z-]*).*/\2/p')
  [ -z "$orientation" ] && echo "Didn't find orientation: '$line'" && orientation=$lastOrientation && continue
  transform=$''+''{matching["$orientation"]}

  monitorValues=$(hyprctl monitors -j | jq '.[] | select(.name == "'$monitor'") | "\(.width)x\(.height)@\(.refreshRate)"' | tr -d '"')
  [ -z "$monitorValues" ] && echo "Didn't find monitor values after line: '$line'" && continue

  hyprctl keyword monitor "$monitor,$monitorValues,auto,auto,transform,$transform" > /dev/null
  eww reload
  echo "Rotation from '$lastOrientation' to '$orientation' at '$monitorValues' on '$monitor'"
done < <(monitor-sensor --accel);
      '');
  };
}

