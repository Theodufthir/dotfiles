#!/bin/sh
args=$([ -z "$1" ] && echo "." || echo "$1")

json=$(nmcli -t device show | perl -ne '
    BEGIN { print "[ ({}" }
    {
        if (/^([^:[]+)(\[([0-9]+)\])?:(.*)$/) {
	    $key = lc($1) . ($3 ? "[".($3-1)."]" : "");
	    $key =~ tr/-//d;
	    print " | .$key = \"$4\"";
        } else {
	    print "), ({}";
        }
    }
    END { print ") ]"}
')

echo '{}' | jq -c "$json | $args"
