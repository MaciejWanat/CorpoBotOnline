#!/bin/bash

printf "Logs merge date: " > logs.txt
date >> logs.txt
for i in `ls ./logs`
do
	cat "./logs/$i" | tr -d '[]{}:,"' | sed 's/data//g' | sed 's/messages//g' | sed 's/text//g' | sed -e $'s/Ty/\\\nTy:/g' | sed -e $'s/CorpoBot/\\\nCorpoBot:/g' >> logs.txt
	printf "\n\n------End of log-------\n" >> logs.txt
done