# Use the latest Arch Linux image as the base
FROM archlinux:latest

# Install necessary packages
RUN pacman -Syu --noconfirm && \
    pacman -S --noconfirm \
    git \
    bash \
    neovim \
    curl \
    unzip \
    ripgrep \
    nodejs \
    npm \
    python3 \
    python-pip \
    base-devel \
    clang \
    clang-tools-extra

# Set the working directory for root
WORKDIR /root/wordir

# Copy the NVChad configuration into the container
COPY .nvchad/starter /root/.config/nvim

# Install NVChad and required plugins
RUN nvim --headless +PackerSync +qall

# Set nvim as the entrypoint
ENTRYPOINT ["nvim"]
