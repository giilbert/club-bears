function num(x: number) {
  const floatArray = new Float64Array(1);
  floatArray[0] = x;
  return new Uint8Array(floatArray.buffer);
}

function concat(...buffers: Uint8Array[]) {
  const bigger = new Uint8Array(
    buffers.reduce((acc, curr) => acc + curr.byteLength, 0)
  );

  let currIndex = 0;
  buffers.forEach((buf) => {
    bigger.set(buf, currIndex);
    currIndex += buf.byteLength;
  });

  return bigger;
}

export { concat, num };
