export default `
uniform float uPixelRatio;
uniform float uSize;
uniform float uTime;

attribute float aScale;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.x += 10.0 * sin(uTime + modelPosition.z * 0.1) * aScale * 0.2;
    modelPosition.y += 10.0 * cos(uTime + modelPosition.x * 0.1) * aScale * 0.2;
    modelPosition.z += 10.0 * sin(uTime + modelPosition.y * 0.1) * aScale * 0.2;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;
    gl_PointSize = uSize * aScale * uPixelRatio;
    gl_PointSize *= (1.0 / -viewPosition.z);
}
`