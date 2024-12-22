# Makefile

.PHONY: install run

# Install dependencies using npm
install:
	cd scrambled-artwork-puzzle
    npm install

# Run the npm script
run:
	cd scrambled-artwork-puzzle
    npm run
