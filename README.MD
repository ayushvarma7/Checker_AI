## Checker Board Game on a 8x8 square matrix

## Aim: To WAP for playing checkers games with a computer using the following game playing strategies discussed in class: 
## a. Random  
## b. Mini-Max  
## c. Alpha-Beta Pruning 


## Rules of the game are following-

## Movement Rules:
A. The ordinary movement of a man: 
1. A man moves diagonally forward left or right from one square to an immediately 
neighboring vacant square. 
2. When a man reaches the farthest row forward (the king-row: top or bottom row 
for opponent player – marked with red in the diagram) it becomes a king. 
B. The ordinary movement of a king (crowned man): 
3. The king moves from one square diagonally forward or backward, left or right, to 
an immediately neighbor vacant square. 

## Capturing Movement Rules: 
4. To capture the opponent’s piece, a man moves from one square over a diagonally 
adjacent and forward square that is occupied by an opponent’s piece and on to a 
vacant square immediately beyond it. On completion of the jump the captured 
piece is removed from the board. 
5. The capturing movement of a king is similar to a man, but it can move both 
directions, forward and backward direction. 
6. The capturing move of the piece (man or king) is continued until all the jumps are 
completed. 
Exception: if a man reaches the king-row by means of a capturing move, it then becomes 
a king but may not make any further jumps in the same turn. 
7. All capturing moves are compulsory, whether offered actively or passively. If 
there are two or more ways to jump, a player might select any one he wishes, not 
necessarily that which gains most pieces. Once started, a multiple jump must be 
carried through to completion. 

## Definition of a Win
8. The winner of the game is one who can make the last move; that is, no move is 
available to the opponent on his turn to play, either because all his pieces have 
been captured or his remaining pieces are all blocked. 
Definition of a Draw
9. The 50-move rule: The game shall be declared drawn if, at any stage of the game 
satisfy one of the followings: 
a. Neither player has advanced an uncrowned man towards the king-row 
during the previous 50 moves. 
b. No pieces have been removed from the board during the previous 50 
moves. 

## Step Choosing Strategy: 
• If there is a capture step, it has to choose that step (refer to rule 7). 
• Choose step that minimizes the number of possibilities of steps (steps without 
being captured) of the opponent. 
• Choose the step that has possibility to capture more than one piece. 
• Choose step so that it can keep the lanes to the king's row blocked for the 
opponent. 
• Choose step that can capture the pieces of the opponent, but the opponent can’t 
do. 
• Looking for step that can move between the own pieces and the opponent in order 
to move adjacent to an opposing checker without loss. 
• Choose step in which if the opponent capture one piece, it can capture the 
opponent at least one piece. 
• Choose the step that can reach the farthest row safely in order to become a king. 
