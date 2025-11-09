import "./menu.css";

export const Menu = () => {
    const menu = document.createElement("div");
    menu.id = "menu";

    const menuWrapper = document.createElement("div");
    menuWrapper.id = "menu-wrapper";

    const contentWrapper = document.createElement("div");
    contentWrapper.id = "menu-content-wrapper";

    const buttonWrapper = document.createElement("div");
    buttonWrapper.id = "menu-button-wrapper";

    menuWrapper.append(contentWrapper, buttonWrapper);
    menu.appendChild(menuWrapper);

    const displayContainer = document.getElementById("display-container");
    const footer = document.getElementsByTagName("footer")[0];
    const displayContainerStyleBottom = () => {
        const style = window.getComputedStyle(displayContainer);
        return displayContainer.getBoundingClientRect().bottom + window.scrollY + parseFloat(style.marginBottom);
    };

    const wrapper = document.getElementById("wrapper");
    const footerStyleTop = () => {
        const style = window.getComputedStyle(wrapper);
        return footer.getBoundingClientRect().top + window.scrollY - parseFloat(style.margin);
    };

    menu.style.top = `${displayContainerStyleBottom()}px`;
    menu.style.height = `${footerStyleTop() - displayContainerStyleBottom()}px`;
    window.addEventListener("resize", () => {
        menu.style.top = `${displayContainerStyleBottom()}px`;
        menu.style.height = `${footerStyleTop() - displayContainerStyleBottom()}px`;
    });

    return [menu, contentWrapper, buttonWrapper];
}
