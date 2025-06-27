# Define constants

# general
mkfile_path := $(abspath $(firstword $(MAKEFILE_LIST)))
current_dir := $(notdir $(patsubst %/,%,$(dir $(mkfile_path))))
current_abs_path := $(subst Makefile,,$(mkfile_path))

# pipeline constants
# PROJECT_NAME
project_image_name := "snap-closet"
project_container_name := "snapcloset-container"
project_dir := "$(current_abs_path)"

# environment variables
# This will not be required for all projects
# include .env

# Build Docker image 
build-only:
	docker build -t $(project_image_name) -f Dockerfile $(current_abs_path)

run-interactive:
	docker build -t $(project_image_name) -f Dockerfile $(current_abs_path)
	docker run -it -v $(current_abs_path):/project -t $(project_image_name) /bin/bash

run-notebooks:
	docker build -t $(project_image_name) -f Dockerfile $(current_abs_path)
	docker run -it \
		-v $(current_abs_path):/project \
		-p 8888:8888 \
		$(project_image_name) \
		jupyter lab --port=8888 --ip='*' --NotebookApp.token='' --NotebookApp.password='' \
		--no-browser --allow-root

