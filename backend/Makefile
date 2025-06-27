# Define constants

# general
mkfile_path := $(abspath $(firstword $(MAKEFILE_LIST)))
current_dir := $(notdir $(patsubst %/,%,$(dir $(mkfile_path))))
current_abs_path := $(subst Makefile,,$(mkfile_path))

# pipeline constants
# PROJECT_NAME
project_image_name := "snap-closet"
project_container_name := "snap-closet-container"
project_dir := "$(current_abs_path)"

# Build Docker image 
build-only:
	docker build \
	-t $(project_image_name) \
	-f Dockerfile $(current_abs_path)

run-interactive:
	docker build \
		-t $(project_image_name) \
		-f Dockerfile $(current_abs_path)
	docker run -it \
		--name $(project_container_name) \
		-v $(current_abs_path):/project \
		-p 8000:8000 \
		$(project_image_name)

