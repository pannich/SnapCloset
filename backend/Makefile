# Define constants

# general
mkfile_path := $(abspath $(firstword $(MAKEFILE_LIST)))
current_dir := $(notdir $(patsubst %/,%,$(dir $(mkfile_path))))
current_abs_path := $(subst Makefile,,$(mkfile_path))

# pipeline constants
# PROJECT_NAME
project_image_name := "snapcloset-backend-image"
project_container_name := "snapcloset-backend-container"
project_dir := "$(current_abs_path)"

# Build Docker image 
build-only:
	docker build \
	-t $(project_image_name) \
	-f Dockerfile $(current_abs_path)

run-dev-local:
	docker build \
		-t $(project_image_name) \
		-f Dockerfile $(current_abs_path)
	docker run -it \
		--rm \
		--name $(project_container_name) \
		-v $(current_abs_path)/app:/project/app \
		-v $(current_abs_path)/data:/project/data \
		-p 8000:8000 \
		--env-file .env.dev \
		$(project_image_name)

run-prod:
	docker build \
		-t $(project_image_name) \
		-f Dockerfile $(current_abs_path)
	docker run -it \
		--rm \
		--name $(project_container_name) \
		-v $(current_abs_path)/app:/project/app \
		-v $(current_abs_path)/data:/project/data \
		-p 8000:8000 \
		--env-file .env.prod \
		$(project_image_name)

